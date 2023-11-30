import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CarouselService {
  constructor(private prisma: PrismaService) {}
  create(establishmentUuid: string) {
    return this.prisma.carousel.create({
      data: {
        establishmentUuid,
      },
    });
  }

  async findAll(establishmentGuid: string) {
    return this.prisma.carousel
      .findMany({
        where: {
          establishmentUuid: establishmentGuid,
        },
      })
      .then((res) => res.map((v) => v.uuid));
  }

  remove(guid: string) {
    return this.prisma.carousel.delete({
      where: {
        uuid: guid,
      },
    });
  }

  removeAll(establishmentGuid: string) {
    return this.prisma.carousel.deleteMany({
      where: {
        establishmentUuid: establishmentGuid,
      },
    });
  }
}
