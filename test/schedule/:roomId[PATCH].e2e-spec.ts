import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../src/app.module";

import { disconnect, Types } from "mongoose";
import { CreateScheduleDto } from "../../src/schedule/dto/CreateSchedule.dto";
import { SCHEDULE_NOT_FOUND } from "../../src/schedule/scheduleConstants";
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
let access_token_for_admin = "";

describe("/schedule/:roomId (PATCH)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		access_token_for_admin = await getAdminAccessToken(app);
	});

	it("success", async () => {
		const createdRoomId = await createRoom(app);
		testScheduleDto.roomId = createdRoomId;
		await createSchedule(app, createdRoomId);

		return request(app.getHttpServer())
			.patch(`/schedule/${testScheduleDto.roomId}`)
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.send({
				...testScheduleDto,
				reservedDay: new Date(2025, 1, 1),
			})
			.expect(200);
	});

	it("without token", async () => {
		return request(app.getHttpServer())
			.patch(`/schedule/${testScheduleDto.roomId}`)
			.send({
				...testScheduleDto,
				reservedDay: new Date(2025, 1, 1),
			})
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(INVALID_TOKEN);
				return;
			});
	});

	it("incorrect id", () => {
		const randomRoomId = new Types.ObjectId().toHexString();
		return request(app.getHttpServer())
			.get(`/schedule/${randomRoomId}`)
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.expect(404, { statusCode: 404, message: SCHEDULE_NOT_FOUND });
	});

	afterAll(async () => {
		await deleteRoom(app, testScheduleDto.roomId);
		await deleteSchedule(app, testScheduleDto.roomId);
		disconnect();
	});
});
