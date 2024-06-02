import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { ImagesService } from '../images/images.service';
import { randomUUID } from 'crypto';

@Injectable()
export class FeedbacksService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  async create(
    establishmentUuid: string,
    image: Express.Multer.File,
    createFeedbackDto: CreateFeedbackDto,
  ) {
    const fileName = `${randomUUID()}-${image.originalname}`;
    const feedbackItens = await this.findAll(establishmentUuid, true);

    await this.imagesService.create(image, fileName);

    return this.prisma.feedback.create({
      data: {
        ...createFeedbackDto,
        establishmentUuid,
        position: feedbackItens.length + 1,
        url: fileName,
      },
    });
  }

  async findAll(establishmentGuid: string, showDisable: boolean = false) {
    return this.prisma.feedback.findMany({
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
        name: true,
        url: true,
      },
    });
  }

  async update(
    guid: string,
    updateFeedbackDto: UpdateFeedbackDto,
    image?: Express.Multer.File,
  ) {
    const feedback = await this.prisma.feedback.update({
      where: {
        uuid: guid,
      },
      data: updateFeedbackDto,
    });

    if (image) {
      await this.imagesService.remove(feedback.url);
      const fileName = `${randomUUID()}-${image.originalname}`;

      await this.imagesService.create(image, fileName);

      return this.prisma.feedback.update({
        where: {
          uuid: guid,
        },
        data: {
          url: fileName,
        },
      });
    }

    return feedback;
  }

  async remove(guid: string) {
    const removedImage = await this.prisma.feedback.delete({
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
      positionsMap.map((item) => this.prisma.feedback.update(item)),
    );
  }

  async setActive(guid: string, isActive: boolean) {
    return this.prisma.feedback.update({
      where: {
        uuid: guid,
      },
      data: {
        isActive,
      },
    });
  }

  async search(establishmentUuid: string, search: string) {
    return this.prisma.feedback.findMany({
      where: {
        establishmentUuid,
        name: {
          contains: search,
        },
      },
      select: {
        uuid: true,
        name: true,
        isActive: true,
        url: true,
      },
    });
  }
}
