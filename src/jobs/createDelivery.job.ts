import { Job } from 'bull';
import { Processor, Process } from '@nestjs/bull';
import { MelhorEnvioService } from '@/modules/melhor-envio/melhor-envio.service';
import { ProductFormatted } from '@/routes/checkout/dto/product-formatted.dto';

export type createDeliveryDTO = {
  product: any;
};

@Processor('create-delivery-job')
export class CreateDeliveryJob {
  constructor(private melhorEnvioService: MelhorEnvioService) {}

  @Process()
  async handle(job: Job<createDeliveryDTO>) {
    const { product } = job.data;

    const productsParsed = JSON.parse(
      product.products as string,
    ) as ProductFormatted[];

    const formattedProducts = productsParsed.map((p) => ({
      name: p.title,
      quantity: String(p.quantity),
      unitary_value: String(p.unit_price),
    }));

    const formattedVolumes = productsParsed.map(() => ({
      width: 10,
      height: 10,
      length: 10,
      weight: 10,
    }));

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
        complement: product.complement,
      },
      products: formattedProducts,
      volumes: formattedVolumes,
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
    console.log(data4.tracking);
    if ((data4 as any).errors)
      throw new Error(JSON.stringify((data4 as any).errors));

    return {};
  }
}
