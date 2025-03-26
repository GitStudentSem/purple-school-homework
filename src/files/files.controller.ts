import {
	Controller,
	HttpCode,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { FileElementResponse } from "./dto/file-element.response";
import { FilesService } from "./files.service";
import { MFile } from "./mfile";
import { JwtAuthGuard } from "../guards/jwt.guard";

@Controller("files")
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post("upload")
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor("files"))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
	): Promise<FileElementResponse[]> {
		const saveArray: MFile[] = [new MFile(file)];

		if (file.mimetype.includes("image")) {
			const buffer = await this.filesService.convertToWebP(file.buffer);

			saveArray.push(
				new MFile({
					originalname: file.originalname,
					buffer,
				}),
			);
		}

		return this.filesService.saveFiles(saveArray);
	}
}
