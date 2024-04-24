import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ImagesService } from '../images/images.service';
import { randomUUID } from 'crypto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';

@Injectable()
export class CarouselService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}
  async create(
    establishmentUuid: string,
    image: Express.Multer.File,
    name: string,
    link?: string,
  ) {
    const fileName = `${randomUUID()}-${image.originalname}`;
    const carouselItens = await this.findAll(establishmentUuid);

    await this.imagesService.create(image, fileName);

    return this.prisma.carousel.create({
      data: {
        establishmentUuid,
        name,
        link,
        position: carouselItens.length + 1,
        url: fileName,
      },
    });
  }

  async update(
    guid: string,
    updateCarouselDto: UpdateCarouselDto,
    image?: Express.Multer.File,
  ) {
    const carousel = await this.prisma.carousel.update({
      where: {
        uuid: guid,
      },
      data: updateCarouselDto,
    });

    if (image) {
      await this.imagesService.remove(carousel.url);
      const fileName = `${randomUUID()}-${image.originalname}`;

      await this.imagesService.create(image, fileName);

      return this.prisma.carousel.update({
        where: {
          uuid: guid,
        },
        data: {
          url: fileName,
        },
      });
    }

    return carousel;
  }

  async findAll(establishmentGuid: string, showDisable: boolean = false) {
    return this.prisma.carousel.findMany({
      where: {
        establishmentUuid: establishmentGuid,
        isActive: showDisable ? undefined : true,
      },
      orderBy: {
        position: 'asc',
      },
      select: {
        isActive: showDisable ? true : undefined,
        uuid: true,
        link: true,
        name: true,
        url: true,
      },
    });
  }

  async remove(guid: string) {
    const removedImage = await this.prisma.carousel.delete({
      where: {
        uuid: guid,
      },
    });

    await this.imagesService.remove(removedImage.url);
  }

  async updatePosition(positions: string[]) {
    const positionsMap = positions.map((itemGuid, index) => ({
      where: { uuid: itemGuid },
      data: { position: index + 1 },
    }));

    return await Promise.all(
      positionsMap.map((item) => this.prisma.carousel.update(item)),
    );
  }

  async setActive(guid: string, isActive: boolean) {
    return this.prisma.carousel.update({
      where: {
        uuid: guid,
      },
      data: {
        isActive,
      },
    });
  }

  async search(search: string) {
    return this.prisma.carousel.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      select: {
        uuid: true,
        name: true,
        link: true,
        isActive: true,
        url: true,
      },
    });
  }
}
