import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/users/users.model";

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private readonly jwtService: JwtService,
	) {}

	async login(email: string): Promise<{ access_token: string }> {
		const payload = { email };
		return { access_token: await this.jwtService.signAsync(payload) };
	}
}
