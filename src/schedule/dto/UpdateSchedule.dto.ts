import { IsDate, IsString } from "class-validator";

export class UpdateScheduleDto {
	@IsString()
	roomId: string;

	@IsDate()
	reservedDay: Date;
}
