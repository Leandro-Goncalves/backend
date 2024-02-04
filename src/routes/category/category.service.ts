import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Errors } from '@/errors';
import { ReorderDto } from './dto/reorder.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async linkProductsToCategory(ProductsUUIDs: string[], categoryUuid: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        uuid: categoryUuid,
      },
    });

    if (!category) {
      throw Errors.Category.NotFound;
    }

    return this.prisma.category.update({
      where: {
        uuid: categoryUuid,
      },
      data: {
        Products: {
          connect: ProductsUUIDs.map((uuid) => ({ uuid })),
        },
      },
    });
  }

  create(establishmentUuid: string, createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        establishmentUuid,
      },
    });
  }

  async reorder(reorderDto: ReorderDto) {
    reorderDto.guids.forEach(async (guid, index) => {
      const asd = await this.prisma.category.update({
        where: {
          uuid: guid,
        },
        data: {
          position: index,
        },
      });
      console.log(asd);
    });
  }

  async findAll(establishmentUuid: string) {
    return this.prisma.category
      .findMany({
        select: {
          uuid: true,
          name: true,
          Products: {
            include: {
              variants: {
                include: {
                  size: true,
                  Image: true,
                },
              },
            },
          },
        },
        where: {
          establishmentUuid,
        },
        orderBy: {
          position: 'asc',
        },
      })
      .then((categories) => {
        return categories.map((category) => {
          return {
            ...category,
            Products: category.Products.flatMap((p) => {
              const totalItems = p.variants.reduce(
                (acc, cur) =>
                  acc + cur.size.reduce((acc, cur) => acc + cur.quantity, 0),
                0,
              );

              if (totalItems === 0) {
                return [];
              }
              return [
                {
                  ...p,
                  variants: p.variants.flatMap((v) => {
                    const totalItems = v.size.reduce(
                      (acc, cur) => acc + cur.quantity,
                      0,
                    );

                    if (totalItems === 0) {
                      return [];
                    }
                    return [
                      {
                        ...v,
                        size: v.size,
                      },
                    ];
                  }),
                },
              ];
            }),
          };
        });
      });
  }

  async update(
    establishmentUuid: string,
    uuid: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.prisma.category
      .update({
        where: {
          uuid,
          establishmentUuid,
        },
        data: updateCategoryDto,
      })
      .catch(() => {
        throw Errors.Category.NotFound;
      });
  }

  async remove(establishmentUuid: string, uuid: string) {
    const category = await this.prisma.category
      .delete({
        where: {
          uuid,
          establishmentUuid,
        },
      })
      .catch(() => {
        throw Errors.Category.NotFound;
      });

    return category;
  }
}
