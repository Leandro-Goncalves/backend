import {
  Controller,
  Post,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Request,
  Get,
} from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { UseAuth } from '@/auth/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from '../users/entities/user.entity';
import { ImagesService } from '../images/images.service';
import { AuthReq } from '@/types/authReq';
import { randomUUID } from 'crypto';

@Controller('carousel')
export class CarouselController {
  constructor(
    private readonly carouselService: CarouselService,
    private imagesService: ImagesService,
  ) {}

  @Get(':establishmentGuid')
  async getAll(@Param('establishmentGuid') establishmentGuid: string) {
    return this.carouselService.findAll(establishmentGuid);
  }

  @UseAuth([Roles.ADMIN])
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Request() req: AuthReq,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const { establishmentUuid } = req.user;
    const carouselImages =
      await this.carouselService.findAll(establishmentUuid);
    carouselImages.forEach(async (uuid) => {
      await this.imagesService.remove(uuid);
    });

    await this.carouselService.removeAll(establishmentUuid);

    images.forEach(async (image) => {
      const name = `${randomUUID()}-${image.originalname}`;
      await this.carouselService.create(establishmentUuid, name);
      this.imagesService.create(image, name);
    });

    return;
  }

  @UseAuth([Roles.ADMIN])
  @Delete(':guid')
  async delete(@Param('guid') guid: string) {
    return this.carouselService.remove(guid);
  }
}
