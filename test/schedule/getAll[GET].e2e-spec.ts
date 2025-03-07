import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../src/app.module";

import { disconnect } from "mongoose";
import { CreateScheduleDto } from "../../src/schedule/dto/CreateSchedule.dto";

import { CreateRoomDto } from "../../src/rooms/dto/CreateRoom.dto";
import {
	createRoom,
	createSchedule,
	deleteRoom,
	deleteSchedule,
	getAdminAccessToken,
} from "../tools";
import { INVALID_TOKEN } from "../../src/guards/guards.constants";

const testScheduleDto: CreateScheduleDto = {
	// Важно вызвать сначала метод создания комнаты и присвоить этот id
	roomId: "",
	reservedDay: new Date(),
};

const testRoomDto: CreateRoomDto = {
	roomNumber: 1,
	sleepingPlacesCount: 1,
	isSeaView: false,
};
let access_token_for_admin = "";

describe("/schedule (GET)", () => {
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
		const createdRoomId = await createRoom(app);
		testScheduleDto.roomId = createdRoomId;
		await createSchedule(app, createdRoomId);

		return request(app.getHttpServer())
			.get("/schedule")
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(INVALID_TOKEN);
				return;
			});
	});

	afterAll(async () => {
		await deleteRoom(app, testScheduleDto.roomId);
		await deleteSchedule(app, testScheduleDto.roomId);
		disconnect();
	});
});
