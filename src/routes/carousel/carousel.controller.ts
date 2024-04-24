import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  Request,
  Get,
  Body,
  Patch,
} from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { UseAuth } from '@/auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../users/entities/user.entity';
import { AuthReq } from '@/types/authReq';
import { UploadedFileImage } from '@/utils/UploadedFileImage';
import { UpdateCarouselDto } from './dto/update-carousel.dto';

@Controller('carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Get(':establishmentGuid')
  async getAllActive(@Param('establishmentGuid') establishmentGuid: string) {
    return this.carouselService.findAll(establishmentGuid);
  }

  @UseAuth([Roles.ADMIN])
  @Get(':establishmentGuid/all')
  async getAll(@Param('establishmentGuid') establishmentGuid: string) {
    return this.carouselService.findAll(establishmentGuid, true);
  }

  @UseAuth([Roles.ADMIN])
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Request() req: AuthReq,
    @Body() { link, name }: { link?: string; name: string },
    @UploadedFileImage() image: Express.Multer.File,
  ) {
    const { establishmentUuid } = req.user;

    await this.carouselService.create(establishmentUuid, image, name, link);

    return;
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':guid/active')
  async setActive(
    @Param('guid') guid: string,
    @Body() { isActive }: { isActive: boolean },
  ) {
    return this.carouselService.setActive(guid, isActive);
  }

  @UseAuth([Roles.ADMIN])
  @Patch('positions')
  async setPosition(@Body() { position }: { position: string[] }) {
    return this.carouselService.updatePosition(position);
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':guid')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('guid') guid: string,
    @Body() updateCarouselDto: UpdateCarouselDto,
    @UploadedFileImage(false) image: Express.Multer.File,
  ) {
    return this.carouselService.update(guid, updateCarouselDto, image);
  }

  @UseAuth([Roles.ADMIN])
  @Post(':guid')
  async search(
    @Param('guid') guid: string,
    @Body() { search }: { search: string },
  ) {
    return this.carouselService.search(search);
  }

  @UseAuth([Roles.ADMIN])
  @Delete(':guid')
  async delete(@Param('guid') guid: string) {
    return this.carouselService.remove(guid);
  }
}
