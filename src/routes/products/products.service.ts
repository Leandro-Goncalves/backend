import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Errors } from '@/errors';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  search(query: string, category: string) {
    // const index = this.algoliaService.initIndex('products');
    console.log(category);

    const filter: any[] = [
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
    ];

    if (category) {
      filter.push({
        category: {
          name: {
            contains: category,
          },
        },
      });
    }

    return this.prisma.products.findMany({
      include: {
        Image: {
          select: {
            imageId: true,
          },
        },
      },
      where: {
        OR: filter,
      },
    });
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
    { sizes, ...createProductDto }: CreateProductDto,
  ) {
    const product = await this.prisma.products.create({
      data: {
        ...createProductDto,
        establishmentUuid,
        ProductsSize: {
          create: sizes.map((size) => ({
            sizeUuid: size,
          })),
        },
      },
    });

    // const index = this.algoliaService.initIndex('products');

    // index.saveObject({
    //   objectID: product.uuid,
    //   title: product.name,
    //   description: product.description,
    // });

    return product;
  }

  async addImages(id: string, images: Express.Multer.File[]) {
    const imageArray = images.map((image) => ({
      imageId: randomUUID(),
      image,
    }));

    await this.prisma.image.createMany({
      data: imageArray.map(({ imageId }) => ({
        imageId,
        productUuid: id,
      })),
    });

    return imageArray;
  }

  async removeImages(id: string) {
    const images = await this.prisma.image.findMany({
      where: {
        productUuid: id,
      },
    });
    await this.prisma.image.deleteMany({
      where: {
        productUuid: id,
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
        price: true,
        quantity: true,
        description: true,
        Image: {
          select: {
            imageId: true,
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
          Image: {
            select: {
              imageId: true,
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
          ProductsSize: undefined,
          sizes: product.ProductsSize.map((size) => size.size),
        };
      })
      .catch(() => {
        throw Errors.Products.NotFound;
      });
  }

  async update(
    establishmentUuid: string,
    guid: string,
    { sizes, ...updateProductDto }: UpdateProductDto,
  ) {
    await this.prisma.productsSize.deleteMany({
      where: {
        productUuid: guid,
      },
    });

    return this.prisma.products
      .update({
        include: {
          ProductsSize: true,
          Image: {
            select: {
              imageId: true,
            },
          },
        },
        where: {
          uuid: guid,
          establishmentUuid,
        },
        data: {
          ...updateProductDto,
          ProductsSize: sizes
            ? {
                create: sizes.map((size) => ({
                  sizeUuid: size,
                })),
              }
            : undefined,
        },
      })
      .catch(() => {
        throw Errors.Products.NotFound;
      });
  }

  async remove(establishmentUuid: string, guid: string) {
    return this.prisma.products
      .delete({
        where: {
          uuid: guid,
          establishmentUuid,
        },
        include: {
          Image: {
            select: {
              imageId: true,
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
