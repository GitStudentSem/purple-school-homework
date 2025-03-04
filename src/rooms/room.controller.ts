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
import { JwtAuthGuard } from "src/guards/jwt.guard";

@Controller("rooms")
export class RoomsController {
	constructor(private readonly roomService: RoomService) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post("create")
	async createRoom(@Body() dto: CreateRoomDto) {
		return this.roomService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get("/:roomId")
	async getById(@Param("roomId") roomId: string) {
		return this.roomService.getById(roomId);
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async getAll() {
		return this.roomService.getAll();
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Patch("/:roomId")
	async update(@Param("roomId") roomId: string, @Body() dto: UpdateRoomDto) {
		return this.roomService.update(roomId, dto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(":roomId")
	async delete(@Param("roomId") roomId: string) {
		return this.roomService.delete(roomId);
	}
}
