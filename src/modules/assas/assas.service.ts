import { Inject, Injectable, Optional } from '@nestjs/common';
import {
  ASSAS_API,
  ASSAS_API_SANDBOX,
  ASSAS_MODULE_OPTIONS,
} from './assas.constants';
import { AssasModuleOptions } from './assas.interface';

interface Payment {
  name: string;
  description: string;
  value: number;
  maxInstallmentCount: number;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX';
}

const headers = (token: string) => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  access_token: token,
});

export const fetchApi = (token: string) => ({
  post: <T>(url: string, body: any) => {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: headers(token),
    }).then((res) => res.json() as T);
  },

  get: <T>(url: string) =>
    fetch(url, {
      headers: headers(token),
    }).then((res) => res.json() as T),
});

@Injectable()
export class AssasService {
  private api: ReturnType<typeof fetchApi>;
  private assasURL: string;
  constructor(
    @Optional()
    @Inject(ASSAS_MODULE_OPTIONS)
    private readonly options: AssasModuleOptions,
  ) {
    this.api = fetchApi(this.options.token);
    this.assasURL =
      this.options.environment === 'homologacao'
        ? ASSAS_API_SANDBOX
        : ASSAS_API;
  }

  paymentLink(paymentProps: Payment) {
    return this.api.post<{
      id: string;
      url: string;
      maxInstallmentCount: number;
    }>(`${this.assasURL}/paymentLinks`, {
      billingType: 'UNDEFINED',
      chargeType: 'INSTALLMENT',
      dueDateLimitDays: 10,
      ...paymentProps,
    });
  }
}
