import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MSchema } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: true, timestamps: true })
export class User {
	@Prop({ required: true })
	email: string;

	@Prop({ required: true })
	passwordHash: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	phoneNumber: string;

	@Prop({ required: true })
	role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
