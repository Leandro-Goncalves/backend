import { Inject, Injectable, Optional } from '@nestjs/common';
import { MELHOR_ENVIO_MODULE_OPTIONS } from './melhor-envio.constants';
import { MelhorEnvioModuleOptions } from './melhor-envio.interface';
import { Shipment } from './services/shipment.service';
import { Cart } from './services/cart.service';
import { Orders } from './services/orders.service';

const headers = (token) => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
  'User-Agent': 'Aplicação (email para contato técnico)',
});

export const fetchApi = (token: string) => ({
  post: <T>(url: string, body: any) =>
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: headers(token),
    }).then((res) => res.json() as T),

  get: <T>(url: string) =>
    fetch(url, {
      headers: headers(token),
    }).then((res) => res.json() as T),
});

@Injectable()
export class MelhorEnvioService {
  constructor(
    @Optional()
    @Inject(MELHOR_ENVIO_MODULE_OPTIONS)
    private readonly options: MelhorEnvioModuleOptions,
  ) {}

  cart = Cart(this.options.token, this.options.environment);
  shipment = Shipment(this.options.token, this.options.environment);
  orders = Orders(this.options.token, this.options.environment);
}
