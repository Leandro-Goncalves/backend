import { Job } from 'bull';
import { Processor, Process } from '@nestjs/bull';
import { MelhorEnvioService } from '@/modules/melhor-envio/melhor-envio.service';
import { ProductFormatted } from '@/routes/checkout/dto/product-formatted.dto';
import { createVolumes } from '@/routes/checkout/checkout.service';
import { PrismaService } from '@/prisma/prisma.service';
import { SizesArray } from '@/utils/sizesArray';

export type createDeliveryDTO = {
  product: any;
  feeValue: number;
};

@Processor('create-delivery-job')
export class CreateDeliveryJob {
  constructor(
    private prisma: PrismaService,
    private melhorEnvioService: MelhorEnvioService,
  ) {}

  @Process()
  async handle(job: Job<createDeliveryDTO>) {
    const { product, feeValue } = job.data;

    const productsParsed = JSON.parse(
      product.products as string,
    ) as ProductFormatted[];

    const formattedProducts = productsParsed.map((p) => {
      console.log(p);
      const size = SizesArray.find((s) => s.guid === (p as any).sizeGuid);

      return {
        name: `(${size.name}) ${p.title} - ${(p as any).variant.name}`,
        quantity: String(p.quantity),
        unitary_value: String(p.unit_price),
      };
    });

    const totalValue = formattedProducts.reduce(
      (acc, item) => acc + Number(item.unitary_value) * Number(item.quantity),
      0,
    );

    const volumes = createVolumes(
      productsParsed.map((p) => ({
        quantity: p.quantity,
        product: {
          uuid: p.id,
        },
      })),
    );

    console.log({ formattedProducts, totalValue });

    const data = await this.melhorEnvioService.cart.add({
      serviceId: String(product.freightId),
      to: {
        address: product.street,
        district: product.neighborhood,
        city: product.city,
        document: product.cpf,
        postal_code: product.cep,
        number: product.number,
        email: product.user.email,
        name: product.user.name,
        phone: product.user.phone,
        complement: product.complement,
      },
      products: [
        ...formattedProducts,
        {
          name: 'Outras despezas',
          quantity: '1',
          unitary_value: String(feeValue),
        },
      ],
      volumes,
      insuranceValue: totalValue,
    });
    console.log({ data });
    if ((data as any).errors)
      throw new Error(JSON.stringify((data as any).errors));

    const data2 = await this.melhorEnvioService.shipment.checkout([data.id]);
    console.log({ data2 });
    if ((data2 as any).errors)
      throw new Error(JSON.stringify((data2 as any).errors));

    const data3 = await this.melhorEnvioService.shipment.generate([data.id]);
    console.log({ data3 });
    if ((data3 as any).errors)
      throw new Error(JSON.stringify((data3 as any).errors));

    const data4 = await this.melhorEnvioService.orders.get(data.id);
    if ((data4 as any).errors)
      throw new Error(JSON.stringify((data4 as any).errors));

    await this.prisma.order.update({
      where: {
        guid: product.guid,
      },
      data: {
        tracking: data4.tracking,
      },
    });

    return {};
  }
}
