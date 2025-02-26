import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ScheduleDocument, Schedule } from "./schedule.model";
import { Model } from "mongoose";
import { CreateScheduleDto } from "./dto/CreateSchedule.dto";

@Injectable()
export class ScheduleService {
	constructor(
		@InjectModel(Schedule.name)
		private schedulewModel: Model<ScheduleDocument>,
	) {}

	async create(dto: CreateScheduleDto): Promise<ScheduleDocument> {
		return this.schedulewModel.create(dto);
	}

	async getById(roomId: string): Promise<ScheduleDocument | null> {
		return this.schedulewModel.findOne({ _id: roomId }).exec();
	}

	async getAll(): Promise<ScheduleDocument[] | null> {
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
