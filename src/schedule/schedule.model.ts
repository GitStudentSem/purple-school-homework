import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema } from "mongoose";

export type ScheduleDocument = HydratedDocument<ScheduleModel>;

Schema({ _id: true, timestamps: true });
export class ScheduleModel {
	@Prop()
	roomId: MSchema.Types.ObjectId;

	@Prop()
	reservedDay: Date;
}

export const ScheduleSchema = SchemaFactory.createForClass(ScheduleModel);
