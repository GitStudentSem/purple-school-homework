import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { CreateScheduleDto } from "./dto/CreateSchedule.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";

@Controller("schedule")
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post("create")
	async create(@Body() dto: CreateScheduleDto) {
		return this.scheduleService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get("/:roomId")
	async getById(@Param("roomId") roomId: string) {
		return this.scheduleService.getById(roomId);
	}

	@UseGuards(JwtAuthGuard)
	@Get()
	async getAll() {
		return this.scheduleService.getAll();
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Patch("/:roomId")
	async update(@Param("roomId") roomId: string, @Body() date: Date) {
		return this.scheduleService.update(roomId, date);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(":roomId")
	async delete(@Param("roomId") roomId: string) {
		return this.scheduleService.delete(roomId);
	}
}
