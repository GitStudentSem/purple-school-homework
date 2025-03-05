import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../src/app.module";

import { disconnect } from "mongoose";
import { CreateRoomDto } from "../../src/rooms/dto/CreateRoom.dto";
import {
	INVALID_ROOM_NUMBER,
	INVALID_SLEEPING_PLACES,
	INVALID_SEA_VIEW,
} from "../../src/rooms/roomConstants";
import {
	FORBIDDEN_MESSAGE,
	INVALID_TOKEN,
} from "../../src/guards/guards.constants";
import { getAdminAccessToken, getUserAccessToken } from "../tools";

const testRoomDto: CreateRoomDto = {
	roomNumber: 1,
	sleepingPlacesCount: 1,
	isSeaView: false,
};

let access_token_for_admin = "";
let access_token_for_user = "";

describe("/rooms/create (POST)", () => {
	let app: INestApplication<App>;
	let createdRoomId: string;

	beforeEach(async () => {
		/**
		 * Имеет ли смысл переписать это на beforeAll что бы ускорить тесты?
		 *
		 * Помоему нет прям сильной необходимости каждый раз заново инициализировать приложение и логинится
		 */
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		access_token_for_admin = await getAdminAccessToken(app);
		access_token_for_user = await getUserAccessToken(app);
	});

	const route = "/rooms/create";

	it("success", async () => {
		return request(app.getHttpServer())
			.post(route)
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.send(testRoomDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				createdRoomId = body._id;
				expect(createdRoomId).toBeDefined();
				return;
			});
	});

	it("without token", async () => {
		return request(app.getHttpServer())
			.post(route)
			.send(testRoomDto)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(INVALID_TOKEN);
				return;
			});
	});

	it("access denied 'user'", async () => {
		return request(app.getHttpServer())
			.post(route)
			.set("Authorization", `Bearer ${access_token_for_user}`)
			.send(testRoomDto)
			.expect(403)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(FORBIDDEN_MESSAGE);
				return;
			});
	});

	it("roomNumber is less than 1", async () => {
		return request(app.getHttpServer())
			.post(route)
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.send({ ...testRoomDto, roomNumber: 0 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message[0]).toBe(INVALID_ROOM_NUMBER);
			});
	});

	it("roomNumber is a string", async () => {
		return request(app.getHttpServer())
			.post(route)
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.send({ ...testRoomDto, roomNumber: "asd" })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message[0]).toBe(INVALID_ROOM_NUMBER);
			});
	});

	it("sleepingPlacesCount is less than 1", async () => {
		return request(app.getHttpServer())
			.post(route)
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.send({ ...testRoomDto, sleepingPlacesCount: 0 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message[0]).toBe(INVALID_SLEEPING_PLACES);
			});
	});

	it("sleepingPlacesCount is more than 6", async () => {
		return request(app.getHttpServer())
			.post(route)
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.send({ ...testRoomDto, sleepingPlacesCount: 7 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message[0]).toBe(INVALID_SLEEPING_PLACES);
			});
	});

	it("sleepingPlacesCount is a string", async () => {
		return request(app.getHttpServer())
			.post(route)
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.send({ ...testRoomDto, sleepingPlacesCount: "asd" })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message[0]).toBe(INVALID_SLEEPING_PLACES);
			});
	});

	it("isSeaView must be boolean", async () => {
		return request(app.getHttpServer())
			.post(route)
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.send({ ...testRoomDto, isSeaView: 0 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message[0]).toBe(INVALID_SEA_VIEW);
			});
	});

	afterAll(() => {
		disconnect();
	});
});
