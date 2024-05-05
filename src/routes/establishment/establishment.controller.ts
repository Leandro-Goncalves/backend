import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFileImage } from '@/utils/UploadedFileImage';

@Controller('establishment')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Get('/status4')
  status() {
    return {
      ok: '14',
    };
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.establishmentService.findOne(uuid);
  }

  @Patch(':uuid')
  @UseInterceptors(FileInterceptor('icon'))
  update(
    @Param('uuid') uuid: string,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto,
    @UploadedFileImage(false) icon: Express.Multer.File,
  ) {
    return this.establishmentService.update(uuid, updateEstablishmentDto, icon);
  }
}
