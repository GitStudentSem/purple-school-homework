import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { App } from "supertest/types";
import { AppModule } from "../../src/app.module";
import { disconnect } from "mongoose";
import { LoginDto } from "../../src/auth/dto/login.dto";
import {
	ALREADY_REGISTERED_ERROR,
	INCORRECT_EMAIL_FORMAT,
	INCORRECT_NAME_FORMAT,
	INCORRECT_NAME_VALUE,
	INCORRECT_PASSWORD_LENGTH,
	INCORRECT_PASSWORD_TYPE,
	INCORRECT_PHONE_NUMBER_FORMAT,
} from "../../src/auth/auth.constants";
import { RegisterDto } from "src/auth/dto/register.dto";

const newUserDto: RegisterDto = {
	email: "purnemtzev.semyon_4@yandex.ru",
	password: "112233",
	name: "Семен",
	phoneNumber: "89211112233",
};

describe("/auth/register (POST)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it("success", async () => {
		return request(app.getHttpServer())
			.post("/auth/register")
			.send(newUserDto)
			.expect(201)
			.then(({ body }: request.Response) => {
				expect(body._id).toBeDefined();
				return;
			});
	});

	it("reguster with a same email", async () => {
		return request(app.getHttpServer())
			.post("/auth/register")
			.send(newUserDto)
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toBe(ALREADY_REGISTERED_ERROR);
				return;
			});
	});

	it("incorrect email", async () => {
		return request(app.getHttpServer())
			.post("/auth/register")
			.send({ ...newUserDto, email: "aaa.ru" })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message[0]).toBe(INCORRECT_EMAIL_FORMAT);
				return;
			});
	});

	it("short password", async () => {
		return request(app.getHttpServer())
			.post("/auth/register")
			.send({ ...newUserDto, password: "123" })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message[0]).toBe(INCORRECT_PASSWORD_LENGTH);
				return;
			});
	});

	it("password is not a string", async () => {
		return request(app.getHttpServer())
			.post("/auth/register")
			.send({ ...newUserDto, password: 1234567 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(INCORRECT_PASSWORD_TYPE);
				return;
			});
	});

	it("short name", async () => {
		return request(app.getHttpServer())
			.post("/auth/register")
			.send({ ...newUserDto, name: "a" })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(INCORRECT_NAME_VALUE);
				return;
			});
	});

	it("name is not a string", async () => {
		return request(app.getHttpServer())
			.post("/auth/register")
			.send({ ...newUserDto, name: 1 })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(INCORRECT_NAME_FORMAT);
				return;
			});
	});

	it("incorrect phone format", async () => {
		return request(app.getHttpServer())
			.post("/auth/register")
			.send({ ...newUserDto, phoneNumber: "8999" })
			.expect(400)
			.then(({ body }: request.Response) => {
				expect(body.message).toContain(INCORRECT_PHONE_NUMBER_FORMAT);
				return;
			});
	});

	afterAll(() => {
		disconnect();
	});
});
