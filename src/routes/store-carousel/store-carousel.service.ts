import { Injectable } from '@nestjs/common';
import { UpdateStoreCarouselDto } from './dto/update-store-carousel.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { ImagesService } from '../images/images.service';
import { randomUUID } from 'crypto';

@Injectable()
export class StoreCarouselService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async create(image: Express.Multer.File, title: string) {
    const fileName = `${randomUUID()}-${image.originalname}`;
    const carouselItens = await this.findAll();

    await this.imagesService.create(image, fileName);

    return this.prisma.storeCarousel.create({
      data: {
        title,
        position: carouselItens.length + 1,
        url: fileName,
      },
    });
  }

  async findAll(showDisable: boolean = false) {
    return this.prisma.storeCarousel.findMany({
      where: {
        isActive: showDisable ? undefined : true,
      },
      orderBy: {
        position: 'asc',
      },
      select: {
        isActive: showDisable ? true : undefined,
        uuid: true,
        url: true,
        title: true,
      },
    });
  }

  async setActive(guid: string, isActive: boolean) {
    return this.prisma.storeCarousel.update({
      where: {
        uuid: guid,
      },
      data: {
        isActive,
      },
    });
  }

  async updatePosition(positions: string[]) {
    const positionsMap = positions.map((itemGuid, index) => ({
      where: { uuid: itemGuid },
      data: { position: index + 1 },
    }));

    return await Promise.all(
      positionsMap.map((item) => this.prisma.storeCarousel.update(item)),
    );
  }

  async update(
    guid: string,
    updateStoreCarouselDto: UpdateStoreCarouselDto,
    image?: Express.Multer.File,
  ) {
    const storeCarousel = await this.prisma.storeCarousel.update({
      where: {
        uuid: guid,
      },
      data: updateStoreCarouselDto,
    });

    if (image) {
      await this.imagesService.remove(storeCarousel.url);
      const fileName = `${randomUUID()}-${image.originalname}`;

      await this.imagesService.create(image, fileName);

      return this.prisma.storeCarousel.update({
        where: {
          uuid: guid,
        },
        data: {
          url: fileName,
        },
      });
    }

    return storeCarousel;
  }

  async remove(guid: string) {
    const removedImage = await this.prisma.storeCarousel.delete({
      where: {
        uuid: guid,
      },
    });

    await this.imagesService.remove(removedImage.url);
  }
}
