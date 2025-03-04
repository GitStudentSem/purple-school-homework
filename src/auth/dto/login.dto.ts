import { IsEmail, IsString, Length } from "class-validator";
import {
	INCORRECT_EMAIL_FORMAT,
	INCORRECT_PASSWORD_LENGTH,
} from "../auth.constants";

export class LoginDto {
	@IsEmail(undefined, { message: INCORRECT_EMAIL_FORMAT })
	email: string;

	@IsString({ message: INCORRECT_PASSWORD_LENGTH })
	@Length(6, undefined, { message: INCORRECT_PASSWORD_LENGTH })
	password: string;
}
