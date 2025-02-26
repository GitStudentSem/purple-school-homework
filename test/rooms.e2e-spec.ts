import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";

import { disconnect, Types } from "mongoose";
import { CreateRoomDto } from "src/rooms/dto/CreateRoom.dto";
import { ROOM_NOT_FOUND } from "../src/rooms/roomConstants";

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

	describe("/rooms/create (POST)", () => {
		it("success", async () => {
			return request(app.getHttpServer())
				.post("/rooms/create")
				.send(testRoomDto)
				.expect(201)
				.then(({ body }: request.Response) => {
					createdRoomId = body._id;
					expect(createdRoomId).toBeDefined();
					return;
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
			const updatedSleepingPlacesCount = 367;

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
					 * что оставлю просто _id
					 */
					expect(body.sleepingPlacesCount).toBe(updatedSleepingPlacesCount);
					return;
				});
		});

		it("incorrect id", async () => {
			const randomRoomId = new Types.ObjectId().toHexString();
			return request(app.getHttpServer())
				.get(`/rooms/${randomRoomId}`)
				.expect(404, { statusCode: 404, message: ROOM_NOT_FOUND });
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
