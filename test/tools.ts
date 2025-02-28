import { Types } from "mongoose";

export const getRandomId = () => new Types.ObjectId().toHexString();
