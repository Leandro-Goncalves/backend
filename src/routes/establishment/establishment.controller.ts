import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';

@Controller('establishment')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.establishmentService.findOne(uuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto,
  ) {
    return this.establishmentService.update(uuid, updateEstablishmentDto);
  }
}
