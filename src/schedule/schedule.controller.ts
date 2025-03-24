import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { CreateScheduleDto } from "./dto/CreateSchedule.dto";
import { JwtAuthGuard } from "../guards/jwt.guard";
import { IdValidationPipe } from "../pipes/id-validation.pipe";
import { MonthValidationPipe } from "../pipes/month-validation.pipe";
import { MONTH_SHOULD_BE_NUMBER } from "./schedule.constants";
import { RoleGuard } from "../guards/role.guard";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../enums/roles";
import { PaginationDto } from "./dto/Pagination.dto";

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
	async getById(@Param("roomId", IdValidationPipe) roomId: string) {
		return this.scheduleService.getById(roomId);
	}

	@Get()
	async getAll(@Query() paginationDto: PaginationDto) {
		return this.scheduleService.getAll(paginationDto);
	}

	@UseGuards(RoleGuard)
	@Roles(Role.Admin)
	@Get("/byMonth/:month")
	async getStatisticByMonth(
		@Param(
			"month",
			new ParseIntPipe({
				errorHttpStatusCode: 400,
				exceptionFactory: () => new BadRequestException(MONTH_SHOULD_BE_NUMBER),
			}),
			MonthValidationPipe,
		)
		month: number,
	) {
		return this.scheduleService.getStatisticByMonth(month);
	}

	@Patch("/:roomId")
	async update(
		@Param("roomId", IdValidationPipe) roomId: string,
		@Body() date: Date,
	) {
		return this.scheduleService.update(roomId, date);
	}

	@Delete(":roomId")
	async delete(@Param("roomId", IdValidationPipe) roomId: string) {
		return this.scheduleService.delete(roomId);
	}
}
