import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../src/app.module";
import { disconnect } from "mongoose";
import { LoginDto } from "../../src/auth/dto/login.dto";
import {
	INCORRECT_EMAIL_FORMAT,
	INCORRECT_PASSWORD_LENGTH,
	INCORRECT_PASSWORD_TYPE,
	USER_NOT_FOUND_ERROR,
} from "../../src/auth/auth.constants";

const loginDto: LoginDto = {
	email: "purnemtzev.semyon@yandex.ru",
	password: "112233",
};

describe("/auth/login (POST)", () => {
	let app: INestApplication<App>;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it("success", async () => {
		return request(app.getHttpServer())
			.post("/auth/login")
			.send(loginDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				expect(body.access_token).toBeDefined();
				return;
			});
	});

	it("non-existent email", async () => {
		return request(app.getHttpServer())
			.post("/auth/login")
			.send({ ...loginDto, email: "aaa@mail.ru" })
			.expect(401)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(USER_NOT_FOUND_ERROR);
				return;
			});
	});

	it("incorrect email", async () => {
		return request(app.getHttpServer())
			.post("/auth/login")
			.send({ ...loginDto, email: "aaa.ru" })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message[0]).toBe(INCORRECT_EMAIL_FORMAT);
				return;
			});
	});

	it("short password", async () => {
		return request(app.getHttpServer())
			.post("/auth/login")
			.send({ ...loginDto, password: "123" })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message[0]).toBe(INCORRECT_PASSWORD_LENGTH);
				return;
			});
	});

	it("password is not a string", async () => {
		return request(app.getHttpServer())
			.post("/auth/login")
			.send({ ...loginDto, password: 1234567 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(INCORRECT_PASSWORD_TYPE);
				return;
			});
	});

	afterAll(() => {
		disconnect();
	});
});
