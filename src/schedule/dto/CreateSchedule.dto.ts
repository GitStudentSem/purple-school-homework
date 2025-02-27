import { IsDate, IsString } from "class-validator";

export class CreateScheduleDto {
	@IsString()
	roomId: string;

	@IsDate()
	reservedDay: Date;
}
