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
import { SetRoleDto } from "../../src/users/dto/setRole.dto";
import {
	INCORRECT_EMAIL_FORMAT,
	USER_NOT_FOUND_ERROR,
} from "../../src/auth/auth.constants";
import { Role } from "../../src/enums/roles";

const setRoleDto: SetRoleDto = {
	email: "purnemtzev.semyon@yandex.ru",
	role: Role.Admin,
};

let access_token_for_admin = "";
let access_token_for_user = "";

describe("/users/setRole (PATCH)", () => {
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
		return request(app.getHttpServer())
			.patch("/users/setRole")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.send(setRoleDto)
			.expect(204);
	});

	it("without token", async () => {
		return request(app.getHttpServer())
			.patch("/users/setRole")
			.send(setRoleDto)
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(INVALID_TOKEN);
				return;
			});
	});

	it("access denied for 'user' role", async () => {
		return request(app.getHttpServer())
			.patch("/users/setRole")
			.set("Authorization", `Bearer ${access_token_for_user}`)
			.send(setRoleDto)
			.expect(403)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(FORBIDDEN_MESSAGE);
				return;
			});
	});

	it("non-existing email", async () => {
		return request(app.getHttpServer())
			.patch("/users/setRole")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.send({ ...setRoleDto, email: "purnemtzev.semyon_-1@yandex.ru" })
			.expect(401)
			.then(({ body }) => {
				expect(body.message).toEqual(USER_NOT_FOUND_ERROR);
			});
	});

	it("invalid email", async () => {
		return request(app.getHttpServer())
			.patch("/users/setRole")
			.set("Authorization", `Bearer ${access_token_for_admin}`)
			.send({ ...setRoleDto, email: "aaa.ru" })
			.expect(400)
			.then(({ body }) => {
				expect(body.message).toContain(INCORRECT_EMAIL_FORMAT);
			});
	});

	afterAll(() => {
		disconnect();
	});
});
