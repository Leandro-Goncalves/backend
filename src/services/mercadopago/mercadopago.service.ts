import { ProductFormatted } from '@/routes/checkout/dto/product-formatted.dto';
import { Injectable } from '@nestjs/common';
import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';
import type { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';
import { v4 as uuidv4 } from 'uuid';

const client = new MercadoPagoConfig({
  accessToken:
    'TEST-4878755021299645-102916-1ecdd5fa39cb68d18a32b440f3b23aa3-1037216092',
});

const preference = new Preference(client);
const payment = new Payment(client);

@Injectable()
export class MercadopagoService {
  constructor() {}

  async generateLinkPayment(email: string, items: ProductFormatted[]) {
    const externalReference = uuidv4();
    const body: PreferenceCreateData['body'] = {
      items,
      payer: {
        email,
      },
      external_reference: externalReference,
    };

    const { init_point } = await preference.create({ body });

    return {
      data: body,
      url: init_point,
    };
  }

  async getPayment(preferenceId: string) {
    try {
      const data = await payment.get({ id: preferenceId });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  async searchPayment(orderId: string) {
    try {
      const data = await payment.get({
        id: orderId,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
