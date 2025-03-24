import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../src/app.module";

import { disconnect } from "mongoose";

import { getAdminAccessToken, getUserAccessToken } from "../tools";
import {
	FORBIDDEN_MESSAGE,
	INVALID_TOKEN,
} from "../../src/guards/guards.constants";
import { MONTH_SHOULD_BE_NUMBER } from "../../src/schedule/schedule.constants";
import { INVALID_MONTH } from "../../src/pipes/pipes.constants";

let access_token_for_admin = "";
let access_token_for_user = "";

describe("/schedule/byMonth/:month", () => {
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
		const { body } = await request(app.getHttpServer())
			.get("/schedule/byMonth/1")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.expect(200);
		expect(body.length).toBeDefined();
	});

	it("without token", async () => {
		return request(app.getHttpServer())
			.get("/schedule/byMonth/1")
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(INVALID_TOKEN);
				return;
			});
	});

	it("access denied for 'user' role", async () => {
		return request(app.getHttpServer())
			.get("/schedule/byMonth/1")
			.set("Authorization", `Bearer ${access_token_for_user}`)
			.expect(403)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(FORBIDDEN_MESSAGE);
				return;
			});
	});

	it("incorrect month type", async () => {
		const { body } = await request(app.getHttpServer())
			.get("/schedule/byMonth/asd")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.expect(400);

		expect(body.message).toBe(MONTH_SHOULD_BE_NUMBER);
	});

	it("incorrect month number", async () => {
		const { body } = await request(app.getHttpServer())
			.get("/schedule/byMonth/40")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.expect(400);

		expect(body.message).toBe(INVALID_MONTH);
	});

	afterAll(async () => {
		disconnect();
	});
});
