import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Errors } from '@/errors';

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

  async findAll(establishmentUuid: string) {
    return this.prisma.category
      .findMany({
        select: {
          uuid: true,
          name: true,
          Products: {
            include: {
              Image: {
                select: {
                  imageId: true,
                },
              },
              ProductsSize: {
                select: {
                  size: {
                    select: {
                      uuid: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          establishmentUuid,
        },
      })
      .then((categories) => {
        return categories.map((category) => {
          return {
            ...category,
            Products: category.Products.map((product) => {
              return {
                ...product,
                ProductsSize: undefined,
                sizes: product.ProductsSize.map((size) => size.size),
              };
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
