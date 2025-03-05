import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema } from "mongoose";
import { Room } from "../rooms/room.model";

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema({ _id: true, timestamps: true })
export class Schedule {
	@Prop({ type: MSchema.Types.ObjectId, ref: () => Room })
	roomId: MSchema.Types.ObjectId;

	@Prop()
	reservedDay: Date;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
