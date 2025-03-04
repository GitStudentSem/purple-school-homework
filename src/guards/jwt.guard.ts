import { UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { INVALID_TOKEN } from "./guards.constants";

export class JwtAuthGuard extends AuthGuard("jwt") {
	handleRequest(err, user, info) {
		// Если произошла ошибка или пользователь не найден
		if (err || !user) {
			throw new UnauthorizedException(INVALID_TOKEN);
		}
		return user; // Возвращаем пользователя (содержит email и role)
	}
}
