import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema } from "mongoose";

export type RoomDocument = HydratedDocument<Room>;

@Schema({ _id: true, timestamps: true })
export class Room {
	@Prop()
	roomNumber: number;

	@Prop()
	sleepingPlacesCount: number;

	@Prop()
	isSeaView: boolean;

	@Prop()
	photos: string[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
