import { MelhorEnvioService } from '@/modules/melhor-envio/melhor-envio.service';
import { Injectable } from '@nestjs/common';
import { SearchFreightDto } from './dto/freight-freight.dto';

const COMPANIES = [1, 2];

@Injectable()
export class FreightService {
  constructor(private melhorEnvioService: MelhorEnvioService) {}

  async get(searchFreightDto: SearchFreightDto) {
    const freight =
      await this.melhorEnvioService.shipment.calculate(searchFreightDto);

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
