import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../src/app.module";

import { disconnect } from "mongoose";
import { CreateScheduleDto } from "../../src/schedule/dto/CreateSchedule.dto";

import {
	createRoom,
	createSchedule,
	deleteRoom,
	deleteSchedule,
	getAdminAccessToken,
} from "../tools";
import { INVALID_TOKEN } from "../../src/guards/guards.constants";
import {
	INVALID_LIMIT_FORMAT,
	INVALID_LIMIT_VALUE,
	INVALID_PAGE_FORMAT,
	INVALID_PAGE_VALUE,
} from "../../src/schedule/schedule.constants";

const testScheduleDto: CreateScheduleDto = {
	// Важно вызвать сначала метод создания комнаты и присвоить этот id
	roomId: "",
	reservedDay: new Date(),
};

let access_token_for_admin = "";

describe("/schedule (GET)", () => {
	let app: INestApplication<App>;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		access_token_for_admin = await getAdminAccessToken(app);
	});

	it("correct", async () => {
		const createdRoomId = await createRoom(app);
		testScheduleDto.roomId = createdRoomId;
		await createSchedule(app, createdRoomId);

		return request(app.getHttpServer())
			.get("/schedule")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBeGreaterThan(0);
				return;
			});
	});

	it("without token", async () => {
		return request(app.getHttpServer())
			.get("/schedule")
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(INVALID_TOKEN);
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
		await deleteRoom(app, testScheduleDto.roomId);
		await deleteSchedule(app, testScheduleDto.roomId);
		disconnect();
	});
});
