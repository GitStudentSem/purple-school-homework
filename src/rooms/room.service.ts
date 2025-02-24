import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RoomDocument, RoomModel } from "./room.model";
import { Model, Types } from "mongoose";
import { CreateRoomDto } from "./dto/CreateRoom.dto";
import { UpdateRoomDto } from "./dto/UpdateRoom.dto";

@Injectable()
export class RoomService {
	constructor(
		@InjectModel(RoomModel.name) private roomModel: Model<RoomDocument>,
	) {}

	async create(dto: CreateRoomDto): Promise<RoomDocument> {
		return this.roomModel.create(dto);
	}

	async getById(roomId: string): Promise<RoomDocument | null> {
		return this.roomModel.findOne({ _id: roomId }).exec();
	}

	async getAll(): Promise<RoomDocument[] | null> {
		return this.roomModel.find().exec();
	}

	async update(
		roomId: string,
		dto: UpdateRoomDto,
	): Promise<RoomDocument | null> {
		return this.roomModel.findByIdAndUpdate(roomId, dto, { new: true }).exec();
	}

	async delete(roomId: string): Promise<RoomDocument | null> {
		return this.roomModel.findByIdAndDelete(roomId).exec();
	}
}
