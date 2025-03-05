import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";

import { disconnect } from "mongoose";
import { CreateRoomDto } from "../src/rooms/dto/CreateRoom.dto";
import {
	INVALID_ROOM_NUMBER,
	ROOM_NOT_FOUND,
	INVALID_SLEEPING_PLACES,
	INVALID_SEA_VIEW,
} from "../src/rooms/roomConstants";
import { getRandomId } from "./tools";

const testRoomDto: CreateRoomDto = {
	roomNumber: 1,
	sleepingPlacesCount: 1,
	isSeaView: false,
};

describe("RoomController (e2e)", () => {
	let app: INestApplication<App>;
	let createdRoomId = "";

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	describe("/rooms (GET)", () => {
		it("correct", async () => {
			return request(app.getHttpServer())
				.get("/rooms")
				.expect(200)
				.then(({ body }: request.Response) => {
					expect(body.length).toBeGreaterThan(0);
					return;
				});
		});
	});

	describe("/rooms/:roomId (PATCH)", () => {
		it("success", async () => {
			const updatedSleepingPlacesCount = 5;

			return request(app.getHttpServer())
				.patch(`/rooms/${createdRoomId}`)
				.send({
					...testRoomDto,
					sleepingPlacesCount: updatedSleepingPlacesCount,
				})
				.expect(200)
				.then(({ body }: request.Response) => {
					expect(body).toEqual(
						expect.objectContaining({
							_id: expect.any(String),
							roomNumber: expect.any(Number),
							sleepingPlacesCount: expect.any(Number),
							isSeaView: expect.any(Boolean),
						}),
					);
				});
		});

		it("incorrect id", async () => {
			return request(app.getHttpServer())
				.patch(`/rooms/${getRandomId()}`)
				.send(testRoomDto)
				.expect(404, { statusCode: 404, message: ROOM_NOT_FOUND });
		});

		it("roomNumber is less than 1", async () => {
			return request(app.getHttpServer())
				.patch(`/rooms/${createdRoomId}`)
				.send({ ...testRoomDto, roomNumber: 0 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(INVALID_ROOM_NUMBER);
				});
		});

		it("roomNumber is a string", async () => {
			return request(app.getHttpServer())
				.patch(`/rooms/${createdRoomId}`)
				.send({ ...testRoomDto, roomNumber: "asd" })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(INVALID_ROOM_NUMBER);
				});
		});

		it("sleepingPlacesCount is less than 1", async () => {
			return request(app.getHttpServer())
				.patch(`/rooms/${createdRoomId}`)
				.send({ ...testRoomDto, sleepingPlacesCount: 0 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(INVALID_SLEEPING_PLACES);
				});
		});

		it("sleepingPlacesCount is more than 6", async () => {
			return request(app.getHttpServer())
				.patch(`/rooms/${createdRoomId}`)
				.send({ ...testRoomDto, sleepingPlacesCount: 7 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(INVALID_SLEEPING_PLACES);
				});
		});

		it("sleepingPlacesCount is a string", async () => {
			return request(app.getHttpServer())
				.patch(`/rooms/${createdRoomId}`)
				.send({ ...testRoomDto, sleepingPlacesCount: "asd" })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(INVALID_SLEEPING_PLACES);
				});
		});

		it("isSeaView must be boolean", async () => {
			return request(app.getHttpServer())
				.patch(`/rooms/${createdRoomId}`)
				.send({ ...testRoomDto, isSeaView: 0 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(INVALID_SEA_VIEW);
				});
		});
	});

	describe("/rooms/:roomId (DELETE)", () => {
		it("success", () => {
			return request(app.getHttpServer())
				.delete(`/rooms/${createdRoomId}`)
				.expect(200);
		});

		it("incorrect id", () => {
			return request(app.getHttpServer())
				.delete(`/rooms/${getRandomId()}`)
				.expect(404, { statusCode: 404, message: ROOM_NOT_FOUND });
		});
	});

	afterAll(() => {
		disconnect();
	});
});
