import { Injectable } from '@nestjs/common';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { randomUUID } from 'crypto';
import { PrismaService } from '@/prisma/prisma.service';
import { ImagesService } from '../images/images.service';

@Injectable()
export class BlockService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async active() {
    return this.prisma.block
      .findMany({
        where: {
          isActive: true,
        },
      })
      .then((blocks) => blocks[0] ?? {});
  }

  async create(image: Express.Multer.File, createBlockDto: CreateBlockDto) {
    const fileName = `${randomUUID()}-${image.originalname}`;
    const blockItens = await this.prisma.block.count();

    await this.imagesService.create(image, fileName);

    return this.prisma.block.create({
      data: {
        ...createBlockDto,
        position: blockItens + 1,
        url: fileName,
      },
    });
  }

  findAll() {
    return this.prisma.block.findMany({
      orderBy: {
        position: 'asc',
      },
      select: {
        guid: true,
        name: true,
        description: true,
        link: true,
        url: true,
        position: true,
        isActive: true,
      },
    });
  }

  async update(
    guid: string,
    updateBlockDto: UpdateBlockDto,
    image?: Express.Multer.File,
  ) {
    const block = await this.prisma.block.update({
      where: { guid },
      data: updateBlockDto,
    });

    if (image) {
      await this.imagesService.remove(block.url);
      const fileName = `${randomUUID()}-${image.originalname}`;
      await Promise.all([
        this.imagesService.create(image, fileName),
        this.prisma.block.update({
          where: { guid },
          data: {
            url: fileName,
          },
        }),
      ]);

      block.url = fileName;
    }

    return block;
  }

  async setActive(guid: string, isActive: boolean) {
    console.log(isActive);
    await this.prisma.block.updateMany({
      where: {
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    return this.prisma.block.update({
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
      positionsMap.map((item) => this.prisma.block.update(item)),
    );
  }

  async remove(guid: string) {
    const removedImage = await this.prisma.block.delete({
      where: {
        guid,
      },
    });

    await this.imagesService.remove(removedImage.url);
  }
}
