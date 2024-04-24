import { Injectable } from '@nestjs/common';
import { CreateFabricDto } from './dto/create-fabric.dto';
import { UpdateFabricDto } from './dto/update-fabric.dto';
import { randomUUID } from 'crypto';
import { PrismaService } from '@/prisma/prisma.service';
import { ImagesService } from '../images/images.service';

@Injectable()
export class FabricsService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async create(image: Express.Multer.File, createFabricDto: CreateFabricDto) {
    const fileName = `${randomUUID()}-${image.originalname}`;
    const fabricsItens = await this.prisma.fabric.count();

    await this.imagesService.create(image, fileName);

    return this.prisma.fabric.create({
      data: {
        ...createFabricDto,
        position: fabricsItens + 1,
        url: fileName,
      },
    });
  }

  findAll(showDisable: boolean = false) {
    return this.prisma.fabric.findMany({
      where: {
        isActive: showDisable ? undefined : true,
      },
      orderBy: {
        position: 'asc',
      },
      select: {
        isActive: showDisable ? true : undefined,
        guid: true,
        description: true,
        name: true,
        url: true,
      },
    });
  }

  async update(
    guid: string,
    updateFabricDto: UpdateFabricDto,
    image?: Express.Multer.File,
  ) {
    const fabric = await this.prisma.fabric.update({
      where: { guid },
      data: updateFabricDto,
    });

    if (image) {
      await this.imagesService.remove(fabric.url);
      const fileName = `${randomUUID()}-${image.originalname}`;
      await Promise.all([
        this.imagesService.create(image, fileName),
        this.prisma.fabric.update({
          where: { guid },
          data: {
            url: fileName,
          },
        }),
      ]);

      fabric.url = fileName;
    }

    return fabric;
  }

  setActive(guid: string, isActive: boolean) {
    return this.prisma.fabric.update({
      where: {
        guid,
      },
      data: {
        isActive,
      },
    });
  }

  async updatePosition(positions: string[]) {
    const positionsMap = positions.map((itemGuid, index) => ({
      where: { guid: itemGuid },
      data: { position: index + 1 },
    }));

    return await Promise.all(
      positionsMap.map((item) => this.prisma.fabric.update(item)),
    );
  }

  async remove(guid: string) {
    const removedImage = await this.prisma.fabric.delete({
      where: {
        guid,
      },
    });

    await this.imagesService.remove(removedImage.url);
  }
}
