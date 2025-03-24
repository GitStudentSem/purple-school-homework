import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RoomDocument, Room } from "./room.model";
import { Model } from "mongoose";
import { CreateRoomDto } from "./dto/CreateRoom.dto";
import { UpdateRoomDto } from "./dto/UpdateRoom.dto";
import { ROOM_NOT_FOUND } from "./room.constants";
import { PaginationDto } from "./dto/Pagination.dto";

@Injectable()
export class RoomService {
	constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

	async create(dto: CreateRoomDto): Promise<RoomDocument> {
		return this.roomModel.create(dto);
	}

	async getById(roomId: string): Promise<RoomDocument | null> {
		const foundedRoom = await this.roomModel.findOne({ _id: roomId }).exec();
		if (!foundedRoom) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return foundedRoom;
	}

	async getAll(paginationDto: PaginationDto): Promise<RoomDocument[] | null> {
		const { page = 1, limit = 10 } = paginationDto;
		const skip = (page - 1) * limit;

		return this.roomModel.find().skip(skip).limit(limit).exec();
	}

	async update(
		roomId: string,
		dto: UpdateRoomDto,
	): Promise<RoomDocument | null> {
		const foundedRoom = await this.roomModel
			.findByIdAndUpdate(roomId, dto, { new: true })
			.exec();
		if (!foundedRoom) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return foundedRoom;
	}

	async delete(roomId: string): Promise<RoomDocument | null> {
		const deletedRoom = await this.roomModel.findByIdAndDelete(roomId).exec();
		if (!deletedRoom) {
			throw new HttpException(ROOM_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedRoom;
	}
}
