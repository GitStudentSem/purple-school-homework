import {
	Body,
	Controller,
	HttpCode,
	Patch,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { SetRoleDto } from "./dto/setRole.dto";
import { JwtAuthGuard } from "src/guards/jwt.guard";
import { RoleGuard } from "src/guards/role.guard";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/auth/auth.constants";

@Controller("users")
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@UsePipes(new ValidationPipe())
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.Admin)
	@Patch("setRole")
	@HttpCode(204)
	async setRole(@Body() dto: SetRoleDto) {
		await this.userService.setRole(dto);
	}
}
