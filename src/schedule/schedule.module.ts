import { Module } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { ScheduleController } from "./schedule.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Schedule, ScheduleSchema } from "./schedule.model";

@Module({
	providers: [ScheduleService],
	controllers: [ScheduleController],
	imports: [
		MongooseModule.forFeature([
			{
				name: Schedule.name,
				schema: ScheduleSchema,
			},
		]),
	],
})
export class ScheduleModule {}
