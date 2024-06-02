import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { StoreCarouselService } from './store-carousel.service';
import { UseAuth } from '@/auth/roles.decorator';
import { Roles } from '../users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFileImage } from '@/utils/UploadedFileImage';
import { UpdateStoreCarouselDto } from './dto/update-store-carousel.dto';

@Controller('store-carousel')
export class StoreCarouselController {
  constructor(private readonly storeCarouselService: StoreCarouselService) {}

  @Get()
  async getAllActive() {
    return this.storeCarouselService.findAll();
  }

  @UseAuth([Roles.ADMIN])
  @Get('all')
  async getAll() {
    return this.storeCarouselService.findAll(true);
  }

  @UseAuth([Roles.ADMIN])
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() { title }: { title: string },
    @UploadedFileImage() image: Express.Multer.File,
  ) {
    await this.storeCarouselService.create(image, title);

    return;
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':guid/active')
  async setActive(
    @Param('guid') guid: string,
    @Body() { isActive }: { isActive: boolean },
  ) {
    return this.storeCarouselService.setActive(guid, isActive);
  }

  @UseAuth([Roles.ADMIN])
  @Patch('positions')
  async setPosition(@Body() { position }: { position: string[] }) {
    return this.storeCarouselService.updatePosition(position);
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':guid')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('guid') guid: string,
    @Body() updateStoreCarouselDto: UpdateStoreCarouselDto,
    @UploadedFileImage(false) image: Express.Multer.File,
  ) {
    return this.storeCarouselService.update(
      guid,
      updateStoreCarouselDto,
      image,
    );
  }

  @UseAuth([Roles.ADMIN])
  @Delete(':guid')
  async delete(@Param('guid') guid: string) {
    return this.storeCarouselService.remove(guid);
  }
}
