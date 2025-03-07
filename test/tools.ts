import { INestApplication } from "@nestjs/common";
import { Types } from "mongoose";
import { LoginDto } from "src/auth/dto/login.dto";
import { CreateRoomDto } from "src/rooms/dto/CreateRoom.dto";

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

const testRoomDto: CreateRoomDto = {
	roomNumber: 1,
	sleepingPlacesCount: 1,
	isSeaView: false,
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

export const createRoom = async (app: INestApplication<App>) => {
	const access_token_for_admin = await getAdminAccessToken(app);

	const response = await request(app.getHttpServer())
		.post("/rooms/create")
		.set("Authorization", `Bearer ${access_token_for_admin}`)
		.send(testRoomDto);

	return response.body._id;
};

export const deleteRoom = async (
	app: INestApplication<App>,
	createdRoomId: string,
) => {
	const access_token_for_admin = await getAdminAccessToken(app);

	const response = await request(app.getHttpServer())
		.delete(`/rooms/${createdRoomId}`)
		.set("Authorization", `Bearer ${access_token_for_admin}`);

	return response.body._id;
};
