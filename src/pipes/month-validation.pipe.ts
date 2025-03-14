import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
} from "@nestjs/common";
import { INVALID_MONTH } from "./pipes.constants";

@Injectable()
export class MonthValidationPipe implements PipeTransform {
	transform(value: number, metadata: ArgumentMetadata) {
		if (metadata.type !== "param") {
			return value;
		}

		if (value < 1 || value > 12) {
			throw new BadRequestException(INVALID_MONTH);
		}

		return value;
	}
}
