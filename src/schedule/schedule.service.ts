import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ScheduleDocument, Schedule } from "./schedule.model";
import { Model } from "mongoose";
import { CreateScheduleDto } from "./dto/CreateSchedule.dto";
import { ROOM_ALREADY_BOOKED, SCHEDULE_NOT_FOUND } from "./schedule.constants";
import { PaginationDto } from "./dto/Pagination.dto";

@Injectable()
export class ScheduleService {
	constructor(
		@InjectModel(Schedule.name)
		private scheduleModel: Model<ScheduleDocument>,
	) {}

	async create(dto: CreateScheduleDto): Promise<ScheduleDocument> {
		const isReservedOnThatDay = await this.scheduleModel
			.findOne({ reservedDay: dto.reservedDay })
			.exec();

		if (isReservedOnThatDay) {
			throw new HttpException(ROOM_ALREADY_BOOKED, HttpStatus.CONFLICT);
		}

		return this.scheduleModel.create(dto);
	}

	async getById(roomId: string): Promise<ScheduleDocument | null> {
		const foundedSchedule = await this.scheduleModel.findOne({ roomId }).exec();
		if (!foundedSchedule) {
			throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return foundedSchedule;
	}

	async getAll(
		paginationDto: PaginationDto,
	): Promise<ScheduleDocument[] | null> {
		const { page = 1, limit = 10 } = paginationDto;
		const skip = (page - 1) * limit;

		return this.scheduleModel.find().skip(skip).limit(limit).exec();
	}

	async getStatisticByMonth(month: number): Promise<ScheduleDocument[]> {
		const currentYear = new Date().getFullYear();
		const startOfMonth = new Date(currentYear, month - 1, 1);
		const endOfMonth = new Date(currentYear, month, 1);

		return await this.scheduleModel
			.aggregate()
			.match({
				reservedDay: {
					$gte: startOfMonth,
					$lt: endOfMonth,
				},
			})
			.group({
				_id: "$roomId",
				count: { $sum: 1 },
			})
			.project({
				_id: 0,
				roomId: "$_id",
				count: 1,
			})
			.sort({ count: -1 });
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
