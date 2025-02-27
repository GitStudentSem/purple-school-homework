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
import { ScheduleService } from "./schedule.service";
import { CreateScheduleDto } from "./dto/CreateSchedule.dto";
import { SCHEDULE_NOT_FOUND } from "./scheduleConstants";

@Controller("schedule")
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}

	// @UsePipes(new ValidationPipe())
	@Post("create")
	async create(@Body() dto: CreateScheduleDto) {
		return this.scheduleService.create(dto);
	}

	// @UsePipes(new ValidationPipe())
	@Get("/:roomId")
	async getById(@Param("roomId") roomId: string) {
		const foundedSchedule = await this.scheduleService.getById(roomId);

		if (!foundedSchedule) {
			throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return foundedSchedule;
	}

	@Get()
	async getAll() {
		return this.scheduleService.getAll();
	}

	// @UsePipes(new ValidationPipe())
	@Patch("/:roomId")
	async update(@Param("roomId") roomId: string, @Body() date: Date) {
		const updatedSchedule = await this.scheduleService.update(roomId, date);
		if (!updatedSchedule) {
			throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return updatedSchedule;
	}

	// @UsePipes(new ValidationPipe())
	@Delete(":roomId")
	async delete(@Param("roomId") roomId: string) {
		const deletedSchedule = await this.scheduleService.delete(roomId);
		if (!deletedSchedule) {
			throw new HttpException(SCHEDULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedSchedule;
	}
}
