import { Injectable } from '@nestjs/common';
import { CreateDoubtDto } from './dto/create-doubt.dto';
import { UpdateDoubtDto } from './dto/update-doubt.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class DoubtsService {
  constructor(private prisma: PrismaService) {}

  async create(createDoubtDto: CreateDoubtDto) {
    const doubts = await this.prisma.doubts.count();
    return this.prisma.doubts.create({
      data: {
        ...createDoubtDto,
        position: doubts + 1,
      },
    });
  }

  findAll() {
    return this.prisma.doubts.findMany({
      orderBy: {
        position: 'asc',
      },
      select: {
        guid: true,
        question: true,
        answer: true,
      },
    });
  }

  findOne(guid: string) {
    return this.prisma.doubts.findUnique({
      where: { guid },
      select: {
        guid: true,
        question: true,
        answer: true,
      },
    });
  }

  update(guid: string, updateDoubtDto: UpdateDoubtDto) {
    return this.prisma.doubts.update({
      where: { guid },
      data: updateDoubtDto,
    });
  }

  async updatePosition(positions: string[]) {
    const positionsMap = positions.map((itemGuid, index) => ({
      where: { guid: itemGuid },
      data: { position: index + 1 },
    }));

    return await Promise.all(
      positionsMap.map((item) => this.prisma.doubts.update(item)),
    );
  }

  remove(guid: string) {
    return this.prisma.doubts.delete({ where: { guid } });
  }
}
