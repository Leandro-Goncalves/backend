import { Injectable } from '@nestjs/common';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class EstablishmentService {
  constructor(private prisma: PrismaService) {}

  findOne(uuid: string) {
    return this.prisma.establishment.findUnique({
      where: {
        uuid,
      },
    });
  }

  update(uuid: string, updateEstablishmentDto: UpdateEstablishmentDto) {
    return this.prisma.establishment.update({
      where: {
        uuid,
      },
      data: updateEstablishmentDto,
    });
  }
}
