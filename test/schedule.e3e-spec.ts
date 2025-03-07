import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";

import { disconnect, Types } from "mongoose";
import { CreateScheduleDto } from "../src/schedule/dto/CreateSchedule.dto";
import { SCHEDULE_NOT_FOUND } from "../src/schedule/scheduleConstants";

const testScheduleDto: CreateScheduleDto = {
	// Важно вызвать сначала метод создания комнаты и присвоить этот id
	roomId: "",
	reservedDay: new Date(),
};

describe("ScheduleController (e2e)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	describe("/schedule/:roomId (DELETE)", () => {
		it("success", () => {
			return request(app.getHttpServer())
				.delete(`/schedule/${testScheduleDto.roomId}`)
				.expect(200);
		});

		it("incorrect id", () => {
			const randomRoomId = new Types.ObjectId().toHexString();
			return request(app.getHttpServer())
				.delete(`/schedule/${randomRoomId}`)
				.expect(404, { statusCode: 404, message: SCHEDULE_NOT_FOUND });
		});
	});

	describe("/rooms/:roomId (DELETE)", () => {
		it("success", () => {
			return request(app.getHttpServer())
				.delete(`/rooms/${testScheduleDto.roomId}`)
				.expect(200);
		});
	});

	afterAll(() => {
		disconnect();
	});
});
