import { Module } from "@nestjs/common";
import { RoomsController } from "./room.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Room, RoomSchema } from "./room.model";
import { RoomService } from "./room.service";

@Module({
	controllers: [RoomsController],
	imports: [
		MongooseModule.forFeature([
			{
				name: Room.name, // Имя коллекции в MongoDB (будет использовано для модели)
				schema: RoomSchema, // Схема, определенная через @nestjs/mongoose
			},
		]),
	],
	providers: [RoomService],
})
export class RoomsModule {}
