import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UsersService } from "src/users/users.service";
import { ALREADY_REGISTERED_ERROR } from "./auth.constants";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UsersService,
	) {}

	@Post("register")
	async register(@Body() dto: RegisterDto) {
		const oldUser = await this.userService.findUser(dto.email);
		if (oldUser) {
			throw new BadRequestException(ALREADY_REGISTERED_ERROR);
		}

		return this.userService.createUser(dto);
	}

	@Post("login")
	async login(@Body() dto: LoginDto) {
		const { email } = await this.userService.validateUser(
			dto.email,
			dto.password,
		);
		return this.authService.login(email);
	}
}
