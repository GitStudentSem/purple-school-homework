import {
	IsEmail,
	IsIn,
	IsPhoneNumber,
	IsString,
	Length,
} from "class-validator";
import {
	INCORRECT_EMAIL_FORMAT,
	INCORRECT_NAME_FORMAT,
	INCORRECT_NAME_VALUE,
	INCORRECT_PASSWORD_LENGTH,
	INCORRECT_PHONE_NUMBER_FORMAT,
	INCORRECT_ROLE_VALUE,
} from "../auth.constants";

export class RegisterDto {
	@IsEmail(undefined, { message: INCORRECT_EMAIL_FORMAT })
	email: string;

	@IsString({ message: INCORRECT_PASSWORD_LENGTH })
	@Length(6, undefined, { message: INCORRECT_PASSWORD_LENGTH })
	password: string;

	@IsString({ message: INCORRECT_NAME_FORMAT })
	@Length(2, undefined, { message: INCORRECT_NAME_VALUE })
	name: string;

	@IsPhoneNumber("RU", { message: INCORRECT_PHONE_NUMBER_FORMAT })
	phoneNumber: string;

	@IsString({ message: INCORRECT_ROLE_VALUE })
	@IsIn(["user", "admin"], { message: INCORRECT_ROLE_VALUE })
	role: string;
}
