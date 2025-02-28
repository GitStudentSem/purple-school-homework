import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ScheduleDocument, Schedule } from "./schedule.model";
import { Model } from "mongoose";
import { CreateScheduleDto } from "./dto/CreateSchedule.dto";
import { SCHEDULE_NOT_FOUND } from "./scheduleConstants";

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
		const foundedSchedule = await this.scheduleModel.findOne({ roomId }).exec();
		if (!foundedSchedule) {
			throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return foundedSchedule;
	}

	async getAll(): Promise<ScheduleDocument[] | null> {
		return this.scheduleModel.find().exec();
	}

	async update(roomId: string, date: Date): Promise<ScheduleDocument | null> {
		const foundedSchedule = await this.scheduleModel.findOne({ roomId }).exec();

		if (!foundedSchedule) {
			throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return this.scheduleModel
			.findByIdAndUpdate(foundedSchedule._id, { roomId, date }, { new: true })
			.exec();
	}

	async delete(roomId: string): Promise<ScheduleDocument | null> {
		const foundedSchedule = await this.scheduleModel.findOne({ roomId }).exec();
		if (!foundedSchedule) {
			throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return this.scheduleModel.findByIdAndDelete(foundedSchedule._id).exec();
	}
}
