import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	HttpCode,
	Patch,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { SetRoleDto } from "./dto/setRole.dto";
import { JwtAuthGuard } from "../guards/jwt.guard";
import { RoleGuard } from "../guards/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../auth/auth.constants";
import { DeleteUserDto } from "./dto/deleteUser.dto";

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

	@UsePipes(new ValidationPipe())
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.Admin)
	@Delete()
	async deleteUser(@Body() dto: DeleteUserDto) {
		return this.userService.deleteUser(dto.email);
	}
}
