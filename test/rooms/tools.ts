import { INestApplication } from "@nestjs/common";
import { App } from "supertest/types";
import * as request from "supertest";
import { getAdminAccessToken } from "test/tools";
import { CreateRoomDto } from "../../src/rooms/dto/CreateRoom.dto";

const testRoomDto: CreateRoomDto = {
	roomNumber: 1,
	sleepingPlacesCount: 1,
	isSeaView: false,
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
