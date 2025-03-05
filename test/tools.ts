import { INestApplication } from "@nestjs/common";
import { Types } from "mongoose";
import { LoginDto } from "src/auth/dto/login.dto";

import * as request from "supertest";
import { App } from "supertest/types";

export const getRandomId = () => new Types.ObjectId().toHexString();

const adminLoginDto: LoginDto = {
	email: "purnemtzev.semyon@yandex.ru",
	password: "112233",
};

const userLoginDto: LoginDto = {
	email: "purnemtzev.semyon_1@yandex.ru",
	password: "112233",
};

export const getAdminAccessToken = async (app: INestApplication<App>) => {
	const response = await request(app.getHttpServer())
		.post("/auth/login")
		.send(adminLoginDto);

	if (!response.body || !response.body.access_token) {
		throw new Error("Failed to obtain admin access token");
	}

	return response.body.access_token;
};

export const getUserAccessToken = async (app: INestApplication<App>) => {
	const response = await request(app.getHttpServer())
		.post("/auth/login")
		.send(userLoginDto);

	if (!response.body || !response.body.access_token) {
		throw new Error("Failed to obtain admin access token");
	}

	return response.body.access_token;
};
