import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { USER_NOT_FOUND_ERROR } from "./auth.constants";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async login(email: string): Promise<{ access_token: string }> {
		const user = await this.userService.findUser(email);

		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		const payload = { email, role: user?.role };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
