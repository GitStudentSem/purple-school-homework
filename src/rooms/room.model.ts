import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema } from "mongoose";

export type RoomDocument = HydratedDocument<RoomModel>;

Schema({ _id: true, timestamps: true });
export class RoomModel {
	@Prop()
	roomNumber: number;

	@Prop()
	sleepingPlacecCount: number;

	@Prop()
	isSeavView: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(RoomModel);
