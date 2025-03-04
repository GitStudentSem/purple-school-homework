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
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";

@Controller("users")
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@UsePipes(new ValidationPipe())
	@UseGuards(JwtAuthGuard)
	@Patch("setRole")
	@HttpCode(204)
	setRole(@Body() dto: SetRoleDto) {
		this.userService.setRole(dto);
	}
}
