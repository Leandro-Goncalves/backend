import { Injectable } from '@nestjs/common';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { SelectThemeDto } from './dto/select-theme.dot';
import { randomUUID } from 'crypto';
import { ImagesService } from '../images/images.service';

@Injectable()
export class EstablishmentService {
  constructor(
    private prisma: PrismaService,
    private imagesService: ImagesService,
  ) {}

  findOne(uuid: string) {
    return this.prisma.establishment.findUnique({
      where: {
        uuid,
      },
    });
  }

  selectTheme(uuid: string, selectThemeDto: SelectThemeDto) {
    return this.prisma.establishment.update({
      where: {
        uuid,
      },
      data: selectThemeDto,
    });
  }

  async update(
    uuid: string,
    updateEstablishmentDto: UpdateEstablishmentDto,
    icon?: Express.Multer.File,
  ) {
    const establishment = await this.prisma.establishment.update({
      where: {
        uuid,
      },
      data: updateEstablishmentDto,
    });

    if (icon) {
      if (establishment.icon) {
        await this.imagesService.remove(establishment.icon);
      }
      const fileName = `${randomUUID()}-${icon.originalname}`;
      await Promise.all([
        this.imagesService.create(icon, fileName),
        this.prisma.establishment.update({
          where: { uuid },
          data: {
            icon: fileName,
          },
        }),
      ]);

      establishment.icon = fileName;
    }

    return establishment;
  }
}
