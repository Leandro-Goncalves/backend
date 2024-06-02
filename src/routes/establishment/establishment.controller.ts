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
import { UpdateStoryDto } from './dto/upsate-story.dto';

@Controller('establishment')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.establishmentService.findOne(uuid);
  }

  @UseInterceptors(FileInterceptor('storyImage'))
  @Patch(':uuid/story')
  updateStory(
    @Param('uuid') uuid: string,
    @Body() updateStoryDto: UpdateStoryDto,
    @UploadedFileImage(false) storyImage: Express.Multer.File,
  ) {
    return this.establishmentService.updateStory(
      uuid,
      updateStoryDto,
      storyImage,
    );
  }

  @Patch(':uuid')
  @UseInterceptors(FileInterceptor('icon'))
  update(
    @Param('uuid') uuid: string,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto,
    @UploadedFileImage(false) icon: Express.Multer.File,
  ) {
    if (updateEstablishmentDto.installments) {
      updateEstablishmentDto.installments = Number(
        updateEstablishmentDto.installments,
      );
    }
    return this.establishmentService.update(uuid, updateEstablishmentDto, icon);
  }
}
