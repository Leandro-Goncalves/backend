import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto, Items } from './dto/create-checkout.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { ProductFormatted } from './dto/product-formatted.dto';
import { OrderStatus } from '@prisma/client';
import { MelhorEnvioService } from '@/modules/melhor-envio/melhor-envio.service';
import { AssasService } from '@/modules/assas/assas.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { createDeliveryDTO } from '@/jobs/createDelivery.job';
import { CreateCheckoutTakeoutDto } from './dto/create-checkout-takeout.dto';
import { Env } from '@/config/env';
import { DiscountCheckoutService } from './discount-checkout/discount-checkout.service';
import { Errors } from '@/errors';

export const createVolumes = (
  itens: { product: { uuid: string }; quantity: number }[],
) => {
  const volumes: any[] = [];

  const addItem = (uuid: string) => {
    const lastItem = volumes[volumes.length - 1];

    if (lastItem === undefined || lastItem?.height === 20) {
      volumes.push({
        id: uuid,
        quantity: 1,
        width: 30,
        height: 5,
        length: 40,
        weight: 0.5,
      });
    } else {
      lastItem.weight += 0.5;
      lastItem.height += 5;
    }
  };

  itens.forEach(({ product, quantity }) => {
    for (let i = 0; i < quantity; i++) {
      addItem(product.uuid);
    }
  });

  return volumes;
};

@Injectable()
export class CheckoutService {
  constructor(
    private assasService: AssasService,
    private prisma: PrismaService,
    private melhorEnvioService: MelhorEnvioService,
    @InjectQueue('create-delivery-job')
    private createDeliveryJob: Queue<createDeliveryDTO>,
    private discountCheckoutService: DiscountCheckoutService,
  ) {}

  private async formatItems(items: Items[]): Promise<ProductFormatted[]> {
    return Promise.all(
      items.map<Promise<ProductFormatted>>(
        async ({ productGuid, variantGuid, quantity, sizeGuid }) => {
          const product = await this.prisma.products.findUnique({
            include: {
              variants: true,
            },
            where: {
              uuid: productGuid,
            },
          });

          const variant = product.variants.find(
            ({ guid }) => guid === variantGuid,
          );

          console.log(product.variants);

          const price = variant?.promotionalPrice || variant.price;

          return {
            id: product.uuid,
            title: product.name,
            description: product.description,
            quantity,
            unit_price: parseFloat(price.toString()),
            variant,
            sizeGuid,
          };
        },
      ),
    );
  }

  async getAllOrders() {
    const parseProducts = (order: any[]) =>
      order.map((o) => ({
        ...o,
        products: JSON.parse(o.products as string),
      }));

    const delivery = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.success,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const cancelled = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.cancelled,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const takeout = await this.prisma.orderTakeout.findMany({
      where: {
        status: OrderStatus.success,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const finishedTakeout = await this.prisma.orderTakeout.findMany({
      where: {
        status: OrderStatus.finished,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const finished = await this.prisma.order.findMany({
      where: {
        status: OrderStatus.finished,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      delivery: parseProducts(delivery),
      takeout: parseProducts(takeout),
      cancelled: parseProducts(cancelled),
      finished: parseProducts([...finished, ...finishedTakeout]),
    };
  }

  async getAllTakeoutOrders() {
    const orders = await this.prisma.orderTakeout.findMany({
      where: {
        status: OrderStatus.success,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order) => ({
      ...order,
      products: JSON.parse(order.products as string),
    }));
  }

  async createTakeout(
    userId: string,
    createCheckoutDto: CreateCheckoutTakeoutDto,
  ) {
    const productFormatted = await this.formatItems(createCheckoutDto.items);

    const itemsTotal = productFormatted.reduce(
      (acc, item) => acc + item.unit_price * item.quantity,
      0,
    );

    const couponDiscount =
      await this.discountCheckoutService.getCouponDiscountValue(
        userId,
        itemsTotal,
        createCheckoutDto.couponCode,
      );

    const total = itemsTotal - couponDiscount.value;

    if (total < 5) {
      throw Errors.Products.InsufficientValue;
    }

    const paymentLink = await this.assasService.paymentLink({
      name: 'Cacau Store',
      description: 'Cacau Store',
      value: total,
    });

    await this.prisma.orderTakeout.create({
      data: {
        guid: paymentLink.id,
        products: JSON.stringify(productFormatted),
        total,
        coupomGuid: couponDiscount.guid,
        userId,
        paymentLink: paymentLink.url,
      },
    });

    return paymentLink.url;
  }

  async create(userId: string, createCheckoutDto: CreateCheckoutDto) {
    const productFormatted = await this.formatItems(createCheckoutDto.items);
    const address = createCheckoutDto.to;
    const isFixedFee = createCheckoutDto.freightId === 10000;

    const itemsTotal = productFormatted.reduce(
      (acc, item) => acc + item.unit_price * item.quantity,
      0,
    );

    const volumes = createVolumes(
      createCheckoutDto.items.map((p) => ({
        quantity: p.quantity,
        product: {
          uuid: p.productGuid,
        },
      })),
    );

    let freight: {
      id: number;
      price: number;
    };

    if (isFixedFee) {
      freight = {
        id: createCheckoutDto.freightId,
        price: 5,
      };
    } else {
      const melhorEnvio = await this.melhorEnvioService.shipment.calculate({
        from: '13736815',
        to: address.cep,
        volumes,
      });

      freight = melhorEnvio.find(
        ({ id }) => id === createCheckoutDto.freightId,
      );
    }

    if (!freight) return;

    const couponDiscount =
      await this.discountCheckoutService.getCouponDiscountValue(
        userId,
        itemsTotal,
        createCheckoutDto.couponCode,
      );

    const total = itemsTotal + Number(freight.price) - couponDiscount.value;

    const paymentLink = await this.assasService.paymentLink({
      name: 'Cacau Store',
      description: 'Cacau Store',
      value: total,
    });

    await this.prisma.order.create({
      data: {
        guid: paymentLink.id,
        products: JSON.stringify(productFormatted),
        total,
        userId,

        freightValue: Number(freight.price),

        coupomGuid: couponDiscount.guid,

        freightId: createCheckoutDto.freightId,
        cep: address.cep,
        city: address.city,
        neighborhood: address.neighborhood,
        state: address.state,
        street: address.street,
        paymentLink: paymentLink.url,
        complement: address.complement,
        number: address.number,
        isFixedFee,
      },
    });

    return paymentLink.url;
  }

  async finishedOrder(orderId: string) {
    const order = await this.getOrder(orderId);

    if (order.type === 'delivery') {
      return this.prisma.order.update({
        where: {
          guid: orderId,
        },
        data: {
          status: OrderStatus.finished,
        },
      });
    }

    return this.prisma.orderTakeout.update({
      where: {
        guid: orderId,
      },
      data: {
        status: OrderStatus.finished,
      },
    });
  }

  async cancelOrder(orderId: string) {
    const order = await this.getOrder(orderId);

    if (order.type === 'delivery') {
      return this.prisma.order.update({
        where: {
          guid: orderId,
        },
        data: {
          status: OrderStatus.cancelled,
        },
      });
    }

    return this.prisma.orderTakeout.update({
      where: {
        guid: orderId,
      },
      data: {
        status: OrderStatus.cancelled,
      },
    });
  }

  async listOrders(userId: string) {
    const ordersToCancel = await this.prisma.order.findMany({
      where: {
        userId,
        status: OrderStatus.pending,
        createdAt: {
          lte: new Date(new Date().getTime() - 30 * 60 * 1000),
        },
      },
    });

    await Promise.all(
      ordersToCancel.map(async (order) => {
        return this.prisma.order.update({
          where: {
            guid: order.guid,
          },
          data: {
            status: OrderStatus.cancelled,
          },
        });
      }),
    );

    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const takeoutOrders = await this.prisma.orderTakeout.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const ordersFormatted = orders.map((o) => ({
      ...o,
      products: JSON.parse(o.products as string),
    }));

    const takeoutOrdersFormatted = takeoutOrders.map((o) => ({
      ...o,
      products: JSON.parse(o.products as string),
    }));

    return [...takeoutOrdersFormatted, ...ordersFormatted];
  }

  async getOrder(orderId: string) {
    const delivery = await this.prisma.order.findUnique({
      where: {
        guid: orderId,
      },
      include: {
        user: true,
      },
    });

    if (delivery)
      return {
        type: 'delivery',
        data: delivery,
      };

    const takeout = await this.prisma.orderTakeout.findUnique({
      where: {
        guid: orderId,
      },
      include: {
        user: true,
      },
    });

    if (takeout)
      return {
        type: 'takeout',
        data: takeout,
      };
  }

  async updatePayment(orderId: string) {
    try {
      const orderType = await this.getOrder(orderId);
      const isDelivery = orderType.type === 'delivery';

      const orderData = {
        where: {
          guid: orderId,
        },
        data: {
          status: OrderStatus.success,
        },
        include: {
          Coupom: true,
          user: {
            select: {
              email: true,
              name: true,
              phone: true,
            },
          },
        },
      };

      let products: any[] = [];
      let productData: any;

      if (isDelivery) {
        const p = await this.prisma.order.update(orderData);

        if (!p) return;
        products = JSON.parse(p.products as string) as any[];
        productData = p;
      } else {
        const p = await this.prisma.orderTakeout.update(orderData);

        if (!p) return;
        products = JSON.parse(p.products as string) as any[];
        productData = p;
      }

      if (products.length === 0) return;

      const productsPromises = products.map(async (p) => {
        const product = await this.prisma.productVariant.findUnique({
          where: {
            guid: p.variant.guid,
          },
        });

        if (!product) return;

        const selectedSize = await this.prisma.productsSize.findFirst({
          where: {
            sizeUuid: p.sizeGuid,
            productVariantGuid: p.variant.guid,
          },
        });

        if (!selectedSize) return;

        if (selectedSize.quantity < p.quantity) {
          await this.prisma.panic.create({
            data: {
              userId: orderType.data.user.uuid,
              order: JSON.stringify({
                data: orderData.data,
                data2: orderType.data,
              }),
            },
          });
          return;
        }

        await this.prisma.productsSize.update({
          where: {
            uuid: selectedSize.uuid,
            productVariantGuid: p.variant.guid,
          },
          data: {
            quantity: {
              decrement: p.quantity,
            },
          },
        });
      });

      await Promise.all(productsPromises);

      if (productData.Coupom && !productData.Coupom.isUnlimited) {
        if (productData.Coupom.quantity > 0) {
          await this.prisma.coupom.update({
            where: {
              code: productData.Coupom.code,
            },
            data: {
              quantity: {
                decrement: 1,
              },
            },
          });
        }

        if (productData.Coupom.quantity === 1) {
          await this.prisma.coupom.update({
            where: {
              code: productData.Coupom.code,
            },
            data: {
              isActive: false,
            },
          });
        }
      }
      if (isDelivery && productData.isFixedFee === false) {
        this.createDeliveryJob.add(
          {
            product: productData,
            feeValue: productData.freightValue,
          },
          {
            backoff: Env.isDev ? 1000 * 10 : 1000 * 60 * 24, // dev 10s, prod 24h
            attempts: 30,
          },
        );
      }
    } catch {}
  }
}
