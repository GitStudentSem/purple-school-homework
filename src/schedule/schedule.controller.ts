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
import { JwtAuthGuard } from "src/guards/jwt.guard";

/**
 * По-моему тут можно и не делать проверку на роль юзера
 * ибо ничего страшного если и админы смогут менять расписание
 *
 * или нет?
 *
 * Не до конца въехал в концепцию приложения
 */
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
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

	@Get()
	async getAll() {
		return this.scheduleService.getAll();
	}

	@Patch("/:roomId")
	async update(@Param("roomId") roomId: string, @Body() date: Date) {
		return this.scheduleService.update(roomId, date);
	}

	@Delete(":roomId")
	async delete(@Param("roomId") roomId: string) {
		return this.scheduleService.delete(roomId);
	}
}
