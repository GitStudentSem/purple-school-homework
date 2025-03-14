import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { RoomService } from "./room.service";
import { CreateRoomDto } from "./dto/CreateRoom.dto";
import { UpdateRoomDto } from "./dto/UpdateRoom.dto";
import { JwtAuthGuard } from "../guards/jwt.guard";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../auth/auth.constants";
import { RoleGuard } from "../guards/role.guard";
import { IdValidationPipe } from "../pipes/id-validation.pipe";

/**
 * Ты про это говорил когда имел в виду что бы я поднял пайпы?
 *
 * Вроде работает, гард для ролей тоже тут ибо он для всех нужен как я понял
 *
 * Пока что не до конца понимаю полную концепцию приложения, как этими роутами будут пользоватся
 */
@Controller("rooms")
@UseGuards(JwtAuthGuard, RoleGuard)
@UsePipes(new ValidationPipe())
export class RoomsController {
	constructor(private readonly roomService: RoomService) {}

	@Roles(Role.Admin)
	@Post("create")
	async createRoom(@Body() dto: CreateRoomDto) {
		return this.roomService.create(dto);
	}

	@Get("/:roomId")
	async getById(@Param("roomId", IdValidationPipe) roomId: string) {
		return this.roomService.getById(roomId);
	}

	@Get()
	async getAll() {
		return this.roomService.getAll();
	}

	@Roles(Role.Admin)
	@Patch("/:roomId")
	async update(
		@Param("roomId", IdValidationPipe) roomId: string,
		@Body() dto: UpdateRoomDto,
	) {
		return this.roomService.update(roomId, dto);
	}

	@Roles(Role.Admin)
	@Delete(":roomId")
	async delete(@Param("roomId", IdValidationPipe) roomId: string) {
		return this.roomService.delete(roomId);
	}
}
