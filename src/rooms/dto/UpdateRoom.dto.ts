import { IsBoolean, IsNumber, Min } from "class-validator";

export class UpdateRoomDto {
	@Min(1)
	@IsNumber()
	roomNumber: number;

	@Min(1)
	@IsNumber()
	sleepingPlacesCount: number;

	@IsBoolean()
	isSeavView: boolean;
}
