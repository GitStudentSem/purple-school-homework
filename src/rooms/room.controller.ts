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
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { RoomService } from "./room.service";
import { CreateRoomDto } from "./dto/CreateRoom.dto";
import { ROOM_NOT_FOUND } from "./roomConstants";
import { UpdateRoomDto } from "./dto/UpdateRoom.dto";

@Controller("rooms")
export class RoomsController {
	constructor(private readonly roomService: RoomService) {}

	@UsePipes(new ValidationPipe())
	@Post("create")
	async createRoom(@Body() dto: CreateRoomDto) {
		return this.roomService.create(dto);
	}

	/**
	 * Нужно ли писать валидацию для параметров урла?
	 */
	// @UsePipes(new ValidationPipe())
	@Get("/:roomId")
	async getById(@Param("roomId") roomId: string) {
		const foundedRoom = await this.roomService.getById(roomId);
		/**
		 * Вот эта проверка везде повторяется,
		 * но я не уверен куда бы ее можно было вынести по правильному,
		 * пока что оставлю так
		 */
		if (!foundedRoom) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return foundedRoom;
	}

	@Get()
	async getAll() {
		return this.roomService.getAll();
	}

	@UsePipes(new ValidationPipe())
	@Patch("/:roomId")
	async update(@Param("roomId") roomId: string, @Body() dto: UpdateRoomDto) {
		const foundedRoom = await this.roomService.update(roomId, dto);
		if (!foundedRoom) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return foundedRoom;
	}

	// @UsePipes(new ValidationPipe())
	@Delete(":roomId")
	async delete(@Param("roomId") roomId: string) {
		const deletedRoom = await this.roomService.delete(roomId);

		if (!deletedRoom) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedRoom;
	}
}
