import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../src/app.module";

import { disconnect } from "mongoose";
import { CreateScheduleDto } from "../../src/schedule/dto/CreateSchedule.dto";
import {
	INCORRECT_DATE,
	INCORRECT_ROOM_ID,
} from "../../src/schedule/scheduleConstants";

import {
	createRoom,
	deleteRoom,
	getAdminAccessToken,
	getUserAccessToken,
} from "../tools";
import { INVALID_TOKEN } from "../../src/guards/guards.constants";

const testScheduleDto: CreateScheduleDto = {
	// Важно вызвать сначала метод создания комнаты и присвоить этот id
	roomId: "",
	reservedDay: new Date(),
};

let access_token_for_admin = "";
let access_token_for_user = "";

describe("/schedule/create (POST)", () => {
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
		testScheduleDto.roomId = await createRoom(app);

		return request(app.getHttpServer())
			.post("/schedule/create")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.send(testScheduleDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				expect(body._id).toBeDefined();
				return;
			});
	});

	it("without token", async () => {
		return request(app.getHttpServer())
			.post("/schedule/create")
			.send(testScheduleDto)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(INVALID_TOKEN);
				return;
			});
	});

	it("incorrect room id type", async () => {
		return request(app.getHttpServer())
			.post("/schedule/create")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.send({ ...testScheduleDto, roomId: 0 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message[0]).toBe(INCORRECT_ROOM_ID);
				return;
			});
	});

	it("incorrect reserved day type", async () => {
		return request(app.getHttpServer())
			.post("/schedule/create")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.send({ ...testScheduleDto, reservedDay: undefined })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message[0]).toBe(INCORRECT_DATE);
				return;
			});
	});

	afterAll(async () => {
		await deleteRoom(app, testScheduleDto.roomId);
		disconnect();
	});
});
