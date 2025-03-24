import { IsEmail, IsString, Length } from "class-validator";
import {
	INCORRECT_EMAIL_FORMAT,
	INCORRECT_PASSWORD_LENGTH,
	INCORRECT_PASSWORD_TYPE,
} from "../auth.constants";

export class LoginDto {
	@IsEmail(undefined, { message: INCORRECT_EMAIL_FORMAT })
	email: string;

	@IsString({ message: INCORRECT_PASSWORD_TYPE })
	@Length(6, undefined, { message: INCORRECT_PASSWORD_LENGTH })
	password: string;
}
