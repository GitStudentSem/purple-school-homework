import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema } from "mongoose";
import { FileElementResponse } from "src/files/dto/file-element.response";

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
	photos: FileElementResponse[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
