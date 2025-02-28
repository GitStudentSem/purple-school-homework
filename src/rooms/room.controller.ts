import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { RoomService } from "./room.service";
import { CreateRoomDto } from "./dto/CreateRoom.dto";
import { UpdateRoomDto } from "./dto/UpdateRoom.dto";

@Controller("rooms")
export class RoomsController {
	constructor(private readonly roomService: RoomService) {}

	@UsePipes(new ValidationPipe())
	@Post("create")
	async createRoom(@Body() dto: CreateRoomDto) {
		return this.roomService.create(dto);
	}

	@Get("/:roomId")
	async getById(@Param("roomId") roomId: string) {
		return this.roomService.getById(roomId);
	}

	@Get()
	async getAll() {
		return this.roomService.getAll();
	}

	@UsePipes(new ValidationPipe())
	@Patch("/:roomId")
	async update(@Param("roomId") roomId: string, @Body() dto: UpdateRoomDto) {
		return this.roomService.update(roomId, dto);
	}

	// @UsePipes(new ValidationPipe())
	@Delete(":roomId")
	async delete(@Param("roomId") roomId: string) {
		return this.roomService.delete(roomId);
	}
}
