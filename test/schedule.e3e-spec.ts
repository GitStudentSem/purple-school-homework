import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../src/app.module";

import { disconnect, Types } from "mongoose";
import { CreateScheduleDto } from "../src/schedule/dto/CreateSchedule.dto";
import {
	INCORRECT_DATE,
	INCORRECT_ROOM_ID,
	SCHEDULE_NOT_FOUND,
} from "../src/schedule/scheduleConstants";
import { CreateRoomDto } from "../src/rooms/dto/CreateRoom.dto";

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

describe("ScheduleController (e2e)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	describe("/schedule (GET)", () => {
		it("correct", async () => {
			return request(app.getHttpServer())
				.get("/schedule")
				.expect(200)
				.then(({ body }: request.Response) => {
					expect(body.length).toBeGreaterThan(0);
					return;
				});
		});
	});

	describe("/schedule/:roomId (PATCH)", () => {
		it("success", async () => {
			return request(app.getHttpServer())
				.patch(`/schedule/${testScheduleDto.roomId}`)
				.send({
					...testScheduleDto,
					reservedDay: new Date(2025, 1, 1),
				})
				.expect(200);
		});

		it("incorrect id", () => {
			const randomRoomId = new Types.ObjectId().toHexString();
			return request(app.getHttpServer())
				.get(`/schedule/${randomRoomId}`)
				.expect(404, { statusCode: 404, message: SCHEDULE_NOT_FOUND });
		});
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
