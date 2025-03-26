import { Module } from "@nestjs/common";
import { ScheduleModule } from "./schedule/schedule.module";
import { RoomsModule } from "./rooms/room.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getMongoConfig } from "./configs/mongo.config";
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';

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
		UsersModule,
		AuthModule,
		FilesModule,
	],
})
export class AppModule {}
