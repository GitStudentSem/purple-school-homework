import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";

import { disconnect, Types } from "mongoose";
import { CreateRoomDto } from "src/rooms/dto/CreateRoom.dto";
import {
	INVALID_ROOM_NUMBER,
	ROOM_NOT_FOUND,
	INVALID_SLEEPING_PLACES,
	INVALID_SEA_VIEW,
} from "../src/rooms/roomConstants";

const testRoomDto: CreateRoomDto = {
	roomNumber: 1,
	sleepingPlacesCount: 1,
	isSeavView: false,
};

describe("RoomController (e2e)", () => {
	let app: INestApplication<App>;
	let createdRoomId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	// described
	describe("/rooms/create (POST)", () => {
		const route = "/rooms/create";
		it("success", async () => {
			return request(app.getHttpServer())
				.post(route)
				.send(testRoomDto)
				.expect(201)
				.then(({ body }: request.Response) => {
					createdRoomId = body._id;
					expect(createdRoomId).toBeDefined();
					return;
				});
		});

		it("roomNumber is less than 1", async () => {
			return request(app.getHttpServer())
				.post(route)
				.send({ ...testRoomDto, roomNumber: 0 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(INVALID_ROOM_NUMBER);
				});
		});

		it("roomNumber is a string", async () => {
			return request(app.getHttpServer())
				.post(route)
				.send({ ...testRoomDto, roomNumber: "asd" })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(INVALID_ROOM_NUMBER);
				});
		});

		it("sleepingPlacesCount is less than 1", async () => {
			return request(app.getHttpServer())
				.post(route)
				.send({ ...testRoomDto, sleepingPlacesCount: 0 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(INVALID_SLEEPING_PLACES);
				});
		});

		it("sleepingPlacesCount is more than 6", async () => {
			return request(app.getHttpServer())
				.post(route)
				.send({ ...testRoomDto, sleepingPlacesCount: 7 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(INVALID_SLEEPING_PLACES);
				});
		});

		it("sleepingPlacesCount is a string", async () => {
			return request(app.getHttpServer())
				.post(route)
				.send({ ...testRoomDto, sleepingPlacesCount: "asd" })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(INVALID_SLEEPING_PLACES);
				});
		});

		it("isSeavView must be boolean", async () => {
			return request(app.getHttpServer())
				.post(route)
				.send({ ...testRoomDto, isSeavView: 0 })
				.expect(400)
				.then(({ body }: request.Response) => {
					expect(body.message[0]).toBe(INVALID_SEA_VIEW);
				});
		});
	});

	describe("/rooms/:roomId (GET)", () => {
		it("success", async () => {
			return request(app.getHttpServer())
				.get(`/rooms/${createdRoomId}`)
				.expect(200)
				.then(({ body }: request.Response) => {
					/**
					 * В этом тесте я не уверен, мб есть способ получше
					 * проверить сам объект и наличие полей в нем, но пока
					 * что оставлю просто _id
					 */
					expect(body._id).toBeDefined();
					return;
				});
		});

		it("incorrect id", async () => {
			/**
			 * Не уверен в какую область видимости лучше вынести эту переменную
			 * - на каждый тест
			 * - на каждое описание
			 * - на весь e2e тест глобально как testRoomDto
			 */
			const randomRoomId = new Types.ObjectId().toHexString();

			return request(app.getHttpServer())
				.get(`/rooms/${randomRoomId}`)
				.expect(404, { statusCode: 404, message: ROOM_NOT_FOUND });
		});
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
					/**
					 * В этом тесте я не уверен, мб есть способ получше
					 * проверить сам объект и наличие полей в нем, но пока
					 * что оставлю просто sleepingPlacesCount
					 */
					expect(body.sleepingPlacesCount).toBe(updatedSleepingPlacesCount);
					return;
				});
		});

		it("incorrect id", async () => {
			const randomRoomId = new Types.ObjectId().toHexString();
			return request(app.getHttpServer())
				.patch(`/rooms/${randomRoomId}`)
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

		it("isSeavView must be boolean", async () => {
			return request(app.getHttpServer())
				.patch(`/rooms/${createdRoomId}`)
				.send({ ...testRoomDto, isSeavView: 0 })
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
			const randomRoomId = new Types.ObjectId().toHexString();
			return request(app.getHttpServer())
				.delete(`/rooms/${randomRoomId}`)
				.expect(404, { statusCode: 404, message: ROOM_NOT_FOUND });
		});
	});

	afterAll(() => {
		disconnect();
	});
});
