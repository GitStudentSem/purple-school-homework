import {
	Body,
	Controller,
	HttpCode,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { SetRoleDto } from "./dto/setRole.dto";

@Controller("users")
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@UsePipes(new ValidationPipe())

	@Put("setRole")
	@HttpCode(204)
	setRole(@Body() dto: SetRoleDto) {
		this.userService.setRole(dto);
	}
}
