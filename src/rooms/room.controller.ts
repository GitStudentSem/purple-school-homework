import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { RoomService } from "./room.service";
import { CreateRoomDto } from "./dto/CreateRoom.dto";
import { ROOM_NOT_FOUND } from "./roomConstants";
import { UpdateRoomDto } from "./dto/UpdateRoom.dto";

@Controller("rooms")
export class RoomsController {
	constructor(private readonly roomService: RoomService) {}

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

	@Patch("/:roomId")
	async update(@Param("roomId") roomId: string, @Body() dto: UpdateRoomDto) {
		return this.roomService.update(roomId, dto);
	}

	@Delete(":roomId")
	async delete(@Param("roomId") roomId: string) {
		const deletedRoom = this.roomService.delete(roomId);
		if (!deletedRoom) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}
}
