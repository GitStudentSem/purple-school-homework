import { Role } from "../auth/auth.constants";

export const INCORRECT_ROLE_TYPE = `Роль должна быть строкой`;
export const INCORRECT_ROLE_VALUE = `Роль должна быть '${Role.User}' или '${Role.Admin}'`;
export const INCORRECT_EMAIL_FORMAT = "Неверный формат почты";
