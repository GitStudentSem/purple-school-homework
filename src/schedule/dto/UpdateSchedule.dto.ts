import { IsDate, IsString } from "class-validator";
import { INCORRECT_DATE, INCORRECT_ROOM_ID } from "../scheduleConstants";
import { Transform } from "class-transformer";

export class UpdateScheduleDto {
	@IsString({ message: INCORRECT_ROOM_ID })
	roomId: string;

	@Transform(({ value }) => new Date(value))
	@IsDate({ message: INCORRECT_DATE })
	reservedDay: Date;
}
