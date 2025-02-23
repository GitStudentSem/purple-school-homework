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
import { ScheduleService } from "./schedule.service";
import { CreateScheduleDto } from "./dto/CreateSchedule.dto";
import { SCHEDULE_NOT_FOUND } from "./scheduleConstants";

@Controller("schedule")
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}

	@Post("create")
	async create(@Body() dto: CreateScheduleDto) {
		return this.scheduleService.create(dto);
	}

	@Get("/:roomId")
	async getById(@Param("roomId") roomId: string) {
		return this.scheduleService.getById(roomId);
	}

	@Patch("/:roomId")
	async update(@Param("roomId") roomId: string, @Body() date: Date) {
		return this.scheduleService.update(roomId, date);
	}

	@Delete(":roomId")
	async delete(@Param("roomId") roomId: string) {
		const deletedSchedule = this.scheduleService.delete(roomId);
		if (!deletedSchedule) {
			throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}
}
