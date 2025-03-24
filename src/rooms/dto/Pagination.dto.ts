import { Transform } from "class-transformer";
import { IsOptional, Min, IsNumber } from "class-validator";
import {
	INVALID_LIMIT_FORMAT,
	INVALID_LIMIT_VALUE,
	INVALID_PAGE_FORMAT,
	INVALID_PAGE_VALUE,
} from "../room.constants";

export class PaginationDto {
	@IsOptional()
	@Transform(({ value }) => parseInt(value, 10))
	@IsNumber(undefined, { message: INVALID_PAGE_FORMAT })
	@Min(1, { message: INVALID_PAGE_VALUE })
	page?: number = 1;

	@IsOptional()
	@Transform(({ value }) => parseInt(value, 10))
	@IsNumber(undefined, { message: INVALID_LIMIT_FORMAT })
	@Min(1, { message: INVALID_LIMIT_VALUE })
	limit?: number = 10;
}
