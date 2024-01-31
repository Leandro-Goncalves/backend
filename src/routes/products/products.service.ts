import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Errors } from '@/errors';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, category: string) {
    const filter: any[] = [];

    if (query) {
      filter.push(
        {
          name: {
            contains: query,
          },
        },
        {
          description: {
            contains: query,
          },
        },
      );
    }

    if (category) {
      filter.push({
        category: {
          name: {
            contains: category,
          },
        },
      });
    }

    return this.prisma.products
      .findMany({
        include: {
          variants: {
            include: {
              size: true,
              Image: true,
            },
          },
        },
        where:
          filter.length > 0
            ? {
                OR: filter,
              }
            : {},
      })
      .then((product) => product.filter((p) => p.categoryUuid !== null));
  }

  hideOrShow(uuid: string, isActive: boolean) {
    return this.prisma.products.update({
      where: {
        uuid,
      },
      data: {
        isActive,
      },
    });
  }
  findProductsByCategory(categoryUuid: string) {
    return this.prisma.products.findMany({
      where: {
        categoryUuid,
      },
    });
  }

  async create(
    establishmentUuid: string,
    { variants, ...createProductDto }: CreateProductDto,
  ) {
    const product = await this.prisma.products.create({
      data: {
        ...createProductDto,
        establishmentUuid,
      },
    });

    const promises = variants.map(async ({ sizes, ...v }) => {
      await this.prisma.productVariant.create({
        data: {
          ...v,
          productsUuid: product.uuid,
          size: {
            createMany: {
              data: sizes.map(({ sizeGuid, quantity }) => ({
                sizeUuid: sizeGuid,
                quantity,
              })),
            },
          },
        },
      });
    });

    await Promise.all(promises);

    const productWithVariants = await this.prisma.products.findUnique({
      where: {
        uuid: product.uuid,
      },
      include: {
        variants: true,
      },
    });

    return productWithVariants;
  }

  async addImages(id: string, images: Express.Multer.File[]) {
    const imageArray = images.map((image) => ({
      imageId: randomUUID(),
      image,
    }));

    await this.prisma.image.createMany({
      data: imageArray.map(({ imageId }) => ({
        imageId,
        productVariantGuid: id,
      })),
    });

    return imageArray;
  }

  async removeImages(id: string) {
    const images = await this.prisma.image.findMany({
      where: {
        productVariantGuid: id,
      },
    });
    await this.prisma.image.deleteMany({
      where: {
        productVariantGuid: id,
      },
    });
    return images;
  }

  findAll(establishmentUuid: string) {
    return this.prisma.products.findMany({
      select: {
        uuid: true,
        name: true,
        isActive: true,
        description: true,
        variants: {
          include: {
            Image: true,
          },
        },
      },
      where: {
        establishmentUuid,
      },
    });
  }

  async findOne(establishmentUuid: string, uuid: string) {
    return this.prisma.products
      .findUniqueOrThrow({
        include: {
          variants: {
            include: {
              Image: true,
              size: {
                include: {
                  size: true,
                },
              },
            },
          },
        },
        where: {
          uuid,
          establishmentUuid,
        },
      })
      .then((product) => {
        return {
          ...product,
          variants: product.variants.map((v) => {
            return {
              ...v,
              size: v.size.map((s) => ({
                ...s.size,
                quantity: s.quantity,
              })),
            };
          }),
        };
      })
      .catch(() => {
        throw Errors.Products.NotFound;
      });
  }

  async update(
    establishmentUuid: string,
    guid: string,
    updateProductDto: UpdateProductDto,
  ) {
    const products = await this.prisma.products
      .update({
        include: {
          variants: {
            include: {
              size: true,
              Image: true,
            },
          },
        },
        where: {
          uuid: guid,
          establishmentUuid,
        },
        data: {
          ...updateProductDto,
          variants: undefined,
        },
      })
      .catch(() => {
        throw Errors.Products.NotFound;
      });

    await this.prisma.productsSize.deleteMany({
      where: {
        productVariantGuid: {
          in: products.variants.map((v) => v.guid),
        },
      },
    });

    await this.prisma.productVariant.deleteMany({
      where: {
        productsUuid: products.uuid,
      },
    });

    const promises = updateProductDto.variants.map(async ({ sizes, ...v }) => {
      await this.prisma.productVariant.create({
        data: {
          ...v,
          productsUuid: guid,
          size: {
            createMany: {
              data: sizes.map(({ sizeGuid, quantity }) => ({
                sizeUuid: sizeGuid,
                quantity,
              })),
            },
          },
        },
      });
    });

    await Promise.all(promises);

    return products;
  }

  async remove(establishmentUuid: string, guid: string) {
    return this.prisma.products
      .delete({
        where: {
          uuid: guid,
          establishmentUuid,
        },
        include: {
          variants: {
            select: {
              Image: true,
            },
          },
        },
      })
      .catch((e) => {
        console.log(e);
        throw Errors.Products.NotFound;
      });
  }
}
