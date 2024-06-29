import { MelhorEnvioService } from '@/modules/melhor-envio/melhor-envio.service';
import { Injectable } from '@nestjs/common';
import { SearchFreightDto } from './dto/freight-freight.dto';
import { default as cepType } from 'cep-promise';
import * as getCEP from 'cep-promise';

const COMPANIES = [1, 2];

@Injectable()
export class FreightService {
  constructor(private melhorEnvioService: MelhorEnvioService) {}

  async get(searchFreightDto: SearchFreightDto) {
    const gepPromise = getCEP as any as typeof cepType;
    const data = await gepPromise(searchFreightDto.to).catch(() => null);

    if (data === null) {
      return [];
    }

    if (data.city === 'Mococa') {
      return [
        {
          id: 10000,
          name: 'Mococa/SP',
          price: 0,
          company: {
            name: 'Frete fixo',
          },
          range: {
            min: 1,
            max: 2,
            formatted: `chega em algumas horas.`,
          },
        },
      ];
    }

    const freight = await this.melhorEnvioService.shipment
      .calculate(searchFreightDto)
      .catch(() => []);

    return freight.flatMap((v: any) => {
      if (!COMPANIES.includes(v.company.id)) {
        return [];
      }

      if (v.error) {
        return [];
      }

      return {
        id: v.id,
        name: v.name,
        price: v.price,
        company: v.company,
        range: {
          min: v.delivery_range.min,
          max: v.delivery_range.max,
          formatted: `chega entre ${v.delivery_range.min} a ${v.delivery_range.max} dias úteis`,
        },
      };
    });
  }
}
