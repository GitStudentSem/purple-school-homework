import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/decorators/roles.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const roles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());

		if (!roles) {
			return true; // Если роли не указаны, доступ разрешен
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user; // Пользователь из JwtAuthGuard

		if (!user) {
			throw new UnauthorizedException("Пользователь не авторизован");
		}
		const hasRole = () => roles.some((role) => user.role === role);

		if (!hasRole()) {
			throw new UnauthorizedException("Недостаточно прав для доступа");
		}

		return true;
	}
}
