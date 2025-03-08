import { Module } from "@nestjs/common";
import { RoomsController } from "./room.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { RoomModel, RoomSchema } from "./room.model";
import { RoomService } from "./room.service";

@Module({
	controllers: [RoomsController],
	imports: [
		MongooseModule.forFeature([
			{
				name: RoomModel.name, // Имя коллекции в MongoDB (будет использовано для модели)
				schema: RoomSchema, // Схема, определенная через @nestjs/mongoose
			},
		]),
	],
	providers: [RoomService],
})
export class RoomsModule {}
