import { IsBoolean, IsNumber, Max, Min } from "class-validator";
import {
	INVALID_ROOM_NUMBER,
	INVALID_SEA_VIEW,
	INVALID_SLEEPING_PLACES,
} from "../room.constants";

export class UpdateRoomDto {
	@Min(1, { message: INVALID_ROOM_NUMBER })
	@IsNumber(undefined, { message: INVALID_ROOM_NUMBER })
	roomNumber: number;

	@Min(1, { message: INVALID_SLEEPING_PLACES })
	@Max(6, { message: INVALID_SLEEPING_PLACES })
	@IsNumber(undefined, {
		message: INVALID_SLEEPING_PLACES,
	})
	sleepingPlacesCount: number;

	@IsBoolean({ message: INVALID_SEA_VIEW })
	isSeaView: boolean;
}
