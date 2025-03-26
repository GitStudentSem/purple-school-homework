import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
	ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { FORBIDDEN_MESSAGE, UNAUTHORIZED_USER } from "./guards.constants";

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
			throw new UnauthorizedException(UNAUTHORIZED_USER);
		}
		const hasRole = () => roles.some((role) => user.role === role);

		if (!hasRole()) {
			throw new ForbiddenException(FORBIDDEN_MESSAGE);
		}

		return true;
	}
}
