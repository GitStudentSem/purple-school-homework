import { Module } from "@nestjs/common";
import { ScheduleModule } from "./schedule/schedule.module";
import { RoomsModule } from "./rooms/room.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getMongoConfig } from "./configs/mongo.config";

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		ConfigModule.forRoot(),
		ScheduleModule,
		RoomsModule,
	],
})
export class AppModule {}
