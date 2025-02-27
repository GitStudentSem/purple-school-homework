import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ScheduleDocument, Schedule } from "./schedule.model";
import { Model } from "mongoose";
import { CreateScheduleDto } from "./dto/CreateSchedule.dto";

@Injectable()
export class ScheduleService {
	constructor(
		@InjectModel(Schedule.name)
		private scheduleModel: Model<ScheduleDocument>,
	) {}

	async create(dto: CreateScheduleDto): Promise<ScheduleDocument> {
		return this.scheduleModel.create(dto);
	}

	async getById(roomId: string): Promise<ScheduleDocument | null> {
		return this.scheduleModel.findOne({ roomId }).exec();
	}

	async getAll(): Promise<ScheduleDocument[] | null> {
		return this.scheduleModel.find().exec();
	}

	async update(roomId: string, date: Date): Promise<ScheduleDocument | null> {
		/**
		 * Я не уверен в том что это правильный подход
		 * Сначала найти расписание, а потом удалить его по этому id
		 */
		const foundedSchedule = await this.scheduleModel.findOne({ roomId }).exec();

		if (!foundedSchedule) return null;

		return this.scheduleModel
			.findByIdAndUpdate(foundedSchedule._id, { roomId, date }, { new: true })
			.exec();
	}

	async delete(roomId: string): Promise<ScheduleDocument | null> {
		/**
		 * Я не уверен в том что это правильный подход
		 * Сначала найти расписание, а потом удалить его по этому id
		 */
		const foundedSchedule = await this.scheduleModel.findOne({ roomId }).exec();
		if (!foundedSchedule) return null;
		return this.scheduleModel.findByIdAndDelete(foundedSchedule._id).exec();
	}
}
