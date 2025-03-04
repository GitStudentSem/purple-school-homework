import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./users.model";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "src/auth/dto/register.dto";
import { compare, hash } from "bcryptjs";
import {
	USER_NOT_FOUND_ERROR,
	WRONG_PASSWORD_ERROR,
} from "src/auth/auth.constants";

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
		private readonly jwtService: JwtService,
	) {}

	async findUser(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	async createUser(dto: RegisterDto) {
		const passwordHash = await hash(dto.password, 10);

		const newUser = new this.userModel({
			email: dto.email,
			phoneNumber: dto.phoneNumber,
			passwordHash,
			name: dto.name,
			role: dto.role,
		});

		return newUser.save();
	}

	async validateUser(
		email: string,
		password: string,
	): Promise<Pick<User, "email">> {
		const user = await this.findUser(email);
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		const isCorrectPassword = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}
		return { email: user.email };
	}
}
