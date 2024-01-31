import { Body, Controller, Post } from '@nestjs/common';
import { FreightService } from './freight.service';
import { SearchFreightDto } from './dto/freight-freight.dto';

@Controller('freight')
export class FreightController {
  constructor(private readonly freightService: FreightService) {}
  @Post()
  findOne(@Body() searchFreightDto: SearchFreightDto) {
    return this.freightService.get(searchFreightDto);
  }
}
