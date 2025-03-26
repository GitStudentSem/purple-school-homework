import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { RoomService } from "./room.service";
import { CreateRoomDto } from "./dto/CreateRoom.dto";
import { UpdateRoomDto } from "./dto/UpdateRoom.dto";
import { JwtAuthGuard } from "../guards/jwt.guard";
import { Roles } from "../decorators/roles.decorator";
import { RoleGuard } from "../guards/role.guard";
import { IdValidationPipe } from "../pipes/id-validation.pipe";
import { Role } from "../enums/roles";
import { PaginationDto } from "./dto/Pagination.dto";

@Controller("rooms")
@UsePipes(new ValidationPipe())
export class RoomsController {
	constructor(private readonly roomService: RoomService) {}

	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.Admin)
	@Post("create")
	async createRoom(@Body() dto: CreateRoomDto) {
		return this.roomService.create(dto);
	}

	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.Admin)
	@Post("/addPhotos/:roomId")
	async addPhotos(
		@Param("roomId", IdValidationPipe) roomId: string,
		@Body() { photos }: { photos: string[] },
	) {
		return this.roomService.addPhotos(roomId, photos);
	}

	@Get("/:roomId")
	async getById(@Param("roomId", IdValidationPipe) roomId: string) {
		return this.roomService.getById(roomId);
	}

	@Get()
	async getAll(@Query() paginationDto: PaginationDto) {
		return this.roomService.getAll(paginationDto);
	}

	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.Admin)
	@Patch("/:roomId")
	async update(
		@Param("roomId", IdValidationPipe) roomId: string,
		@Body() dto: UpdateRoomDto,
	) {
		return this.roomService.update(roomId, dto);
	}

	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(Role.Admin)
	@Delete(":roomId")
	async delete(@Param("roomId", IdValidationPipe) roomId: string) {
		return this.roomService.delete(roomId);
	}
}
