import { IsEmail } from "class-validator";
import { INCORRECT_EMAIL_FORMAT } from "../users.constants";

export class DeleteUserDto {
	@IsEmail(undefined, { message: INCORRECT_EMAIL_FORMAT })
	email: string;
}
