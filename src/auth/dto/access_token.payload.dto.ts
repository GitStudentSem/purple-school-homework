import { Role } from "../../enums/roles";

export class AccessTokenPayloadDto {
	email: string;
	role: Role;
}
