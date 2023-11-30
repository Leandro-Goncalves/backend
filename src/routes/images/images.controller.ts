import {
  Controller,
  Post,
  Patch,
  Param,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post(':productId')
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Param('productId') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return Promise.all(
      files.map((file) => this.imagesService.create(file, productId)),
    );
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.imagesService.update(id, file);
  }
}
