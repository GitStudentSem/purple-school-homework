import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./users.model";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "../auth/dto/register.dto";
import { compare, hash } from "bcryptjs";
import {
	Role,
	USER_NOT_FOUND_ERROR,
	WRONG_PASSWORD_ERROR,
} from "../auth/auth.constants";
import { SetRoleDto } from "./dto/setRole.dto";

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
		private readonly jwtService: JwtService,
	) {}

	async findUser(email: string): Promise<UserDocument | null> {
		const foundedUser = await this.userModel.findOne({ email }).exec();

		return foundedUser;
	}

	async createUser(dto: RegisterDto): Promise<UserDocument> {
		const passwordHash = await hash(dto.password, 10);

		const newUser = new this.userModel({
			email: dto.email,
			phoneNumber: dto.phoneNumber,
			passwordHash,
			name: dto.name,
			role: Role.User,
		});
		const savedUser = await newUser.save();
		return savedUser;
	}

	async validateUser(
		email: string,
		password: string,
	): Promise<Pick<User, "email">> {
		const foundedUser = await this.findUser(email);

		if (!foundedUser) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		const isCorrectPassword = await compare(password, foundedUser.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}
		return { email: foundedUser.email };
	}

	async setRole(dto: SetRoleDto): Promise<void> {
		const foundedUser = await this.findUser(dto.email);

		if (!foundedUser) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		await this.userModel.updateOne(
			{ email: dto.email },
			{ $set: { role: dto.role } },
		);

		/**
		 * Тут не ясно че лучше вернуть
		 * Можно вернуть 204 как успех
		 * Можно вернуть новые данные юзера {email, role}
		 * Но тогда нужно проверить что документ все же был обновлен
		 *
		 * А если нет, то видимо выбрасывать ошибку я хз
		 *
		 * Пока что оставлю воид и 204
		 */
	}

	async deleteUser(email: string): Promise<void> {
		const { deletedCount } = await this.userModel.deleteOne({ email }).exec();

		if (deletedCount === 0) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}
	}
}
