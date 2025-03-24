import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../src/app.module";

import { disconnect } from "mongoose";
import { CreateRoomDto } from "../../src/rooms/dto/CreateRoom.dto";
import { ROOM_NOT_FOUND } from "../../src/rooms/roomConstants";
import { getAdminAccessToken, getRandomId, getUserAccessToken } from "../tools";
import { INVALID_TOKEN } from "../../src/guards/guards.constants";
import { createRoom, deleteRoom } from "../tools";

const testRoomDto: CreateRoomDto = {
	roomNumber: 1,
	sleepingPlacesCount: 1,
	isSeaView: false,
};

let createdRoomId = "";
let access_token_for_admin = "";
let access_token_for_user = "";

describe("/rooms/:roomId (GET)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		access_token_for_admin = await getAdminAccessToken(app);
		access_token_for_user = await getUserAccessToken(app);
	});

	it("success", async () => {
		createdRoomId = await createRoom(app);

		return request(app.getHttpServer())
			.get(`/rooms/${createdRoomId}`)
			.set("Authorization", `Bearer ${access_token_for_admin}`)
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

	it("without token", async () => {
		return request(app.getHttpServer())
			.get(`/rooms/${createdRoomId}`)
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
			.get(`/rooms/${getRandomId()}`)
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.expect(404, { statusCode: 404, message: ROOM_NOT_FOUND });
	});

	afterAll(async () => {
		await deleteRoom(app, createdRoomId);
		disconnect();
	});
});
