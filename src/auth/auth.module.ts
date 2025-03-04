import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getJWTConfig } from "src/configs/jwt.config";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/users/users.model";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UsersService } from "src/users/users.service";

@Module({
	controllers: [AuthController],
	providers: [AuthService, UsersService, JwtStrategy],
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name, // Имя коллекции в MongoDB (будет использовано для модели)
				schema: UserSchema, // Схема, определенная через @nestjs/mongoose
			},
		]),
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig,
		}),
		PassportModule,
	],
})
export class AuthModule {}
