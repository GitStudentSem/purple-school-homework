import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async login(email: string): Promise<{ access_token: string }> {
		const user = await this.userService.findUser(email);
		const payload = { email, role: user?.role };
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}
}
