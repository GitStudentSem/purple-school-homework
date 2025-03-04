import { IsEmail, IsIn, IsString } from "class-validator";
import {
	INCORRECT_EMAIL_FORMAT,
	INCORRECT_ROLE_VALUE,
} from "../users.constants";

export class SetRoleDto {
	@IsEmail(undefined, { message: INCORRECT_EMAIL_FORMAT })
	email: string;

	@IsString({ message: INCORRECT_ROLE_VALUE })
	@IsIn(["user", "admin"], { message: INCORRECT_ROLE_VALUE })
	role: string;
}
