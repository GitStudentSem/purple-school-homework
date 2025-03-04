import { IsEmail, IsString } from "class-validator";

export class LoginDto {
	@IsEmail(undefined, { message: "Неверный формат почты" })
	email: string;

	@IsString()
	password: string;
}
