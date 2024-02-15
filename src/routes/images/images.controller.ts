import {
  Controller,
  Post,
  Patch,
  Param,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Get,
  Res,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

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

  @Get(':id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const image = await fetch(`https://cacau.b-cdn.net/${id}`);

    const blob = await image.blob();
    const buffer = await blob.arrayBuffer();

    res.setHeader('Content-Type', blob.type);
    res.setHeader('Content-Disposition', `attachment; filename=${id}`);
    res.send(Buffer.from(buffer));
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.imagesService.update(id, file);
  }
}
