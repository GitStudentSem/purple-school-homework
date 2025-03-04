import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

export class RegisterDto {
	@IsEmail(undefined, { message: "Неверный формат почты" })
	email: string;

	@IsString()
	password: string;

	@IsString()
	name: string;

	@IsPhoneNumber()
	phoneNumber: string;

	@IsString()
	role: string;
}
