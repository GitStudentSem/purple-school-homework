import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../src/app.module";

import { disconnect } from "mongoose";
import { getAdminAccessToken } from "../tools";
import { createRoom } from "./tools";

let access_token_for_admin = "";

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
		await createRoom(app);

		return request(app.getHttpServer())
			.get("/rooms")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body.length).toBeGreaterThan(0);
				return;
			});
	});

	afterAll(() => {
		disconnect();
	});
});
