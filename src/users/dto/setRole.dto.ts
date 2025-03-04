import { IsEmail, IsIn, IsString } from "class-validator";
import {
	INCORRECT_EMAIL_FORMAT,
	INCORRECT_ROLE_VALUE,
} from "../users.constants";
import { Role } from "src/auth/auth.constants";

export class SetRoleDto {
	@IsEmail(undefined, { message: INCORRECT_EMAIL_FORMAT })
	email: string;

	@IsString({ message: INCORRECT_ROLE_VALUE })
	@IsIn([Role.User, Role.Admin], { message: INCORRECT_ROLE_VALUE })
	role: string;
}
