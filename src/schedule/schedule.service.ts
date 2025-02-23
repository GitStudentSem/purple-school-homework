import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ScheduleDocument, ScheduleModel } from "./schedule.model";
import { Model } from "mongoose";
import { CreateScheduleDto } from "./dto/CreateSchedule.dto";

@Injectable()
export class ScheduleService {
	constructor(
		@InjectModel(ScheduleModel.name)
		private schedulewModel: Model<ScheduleDocument>,
	) {}

	async create(dto: CreateScheduleDto): Promise<ScheduleDocument> {
		return this.schedulewModel.create(dto);
	}

	// Че тут по возвращаемому типу не ясно
	async getById(roomId: string) {
		return this.schedulewModel.find({ _id: roomId }).exec();
	}

	async getAll() {
		return this.schedulewModel.find().exec();
	}

	async update(roomId: string, date: Date) {
		return this.schedulewModel
			.findByIdAndUpdate(roomId, date, { new: true })
			.exec();
	}

	async delete(roomId: string) {
		return this.schedulewModel.findByIdAndDelete(roomId).exec();
	}
}
