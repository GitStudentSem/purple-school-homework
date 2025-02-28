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
				name: Schedule.name, // Имя коллекции в MongoDB (будет использовано для модели)
				schema: ScheduleSchema, // Схема, определенная через @nestjs/mongoose
			},
		]),
	],
})
export class ScheduleModule {}
