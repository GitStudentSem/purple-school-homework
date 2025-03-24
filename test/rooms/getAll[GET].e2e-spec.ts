import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../src/app.module";

import { disconnect } from "mongoose";
import { getAdminAccessToken } from "../tools";
import { createRoom, deleteRoom } from "../tools";
import {
	INVALID_LIMIT_FORMAT,
	INVALID_LIMIT_VALUE,
	INVALID_PAGE_FORMAT,
	INVALID_PAGE_VALUE,
} from "../../src/rooms/room.constants";

let access_token_for_admin = "";
const createdRoomsIds: string[] = [];

describe("/ (GET)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		access_token_for_admin = await getAdminAccessToken(app);
	});

	it("correct", async () => {
		createdRoomsIds.push(await createRoom(app));

		return request(app.getHttpServer())
			.get("/rooms")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBeGreaterThan(0);
				return;
			});
	});

	it("correct with params", async () => {
		createdRoomsIds.push(await createRoom(app));

		return request(app.getHttpServer())
			.get("/rooms?page=1&limit=2")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBeGreaterThan(0);

				return;
			});
	});

	it("invalid page parameter format", async () => {
		return request(app.getHttpServer())
			.get("/rooms?page=asd&limit=2")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(INVALID_PAGE_FORMAT);
				return;
			});
	});

	it("invalid page parameter value", async () => {
		return request(app.getHttpServer())
			.get("/rooms?page=-1&limit=2")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(INVALID_PAGE_VALUE);
				return;
			});
	});

	it("invalid limit parameter format", async () => {
		return request(app.getHttpServer())
			.get("/rooms?page=1&limit=asd")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(INVALID_LIMIT_FORMAT);
				return;
			});
	});

	it("invalid limit parameter value", async () => {
		return request(app.getHttpServer())
			.get("/rooms?page=1&limit=-1")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(INVALID_LIMIT_VALUE);
				return;
			});
	});

	afterAll(async () => {
		for (const createdRoomId of createdRoomsIds) {
			await deleteRoom(app, createdRoomId);
		}

		disconnect();
	});
});
