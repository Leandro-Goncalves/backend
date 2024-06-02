import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Roles } from '../users/entities/user.entity';
import { UseAuth } from '@/auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFileImage } from '@/utils/UploadedFileImage';
import { AuthReq } from '@/types/authReq';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Get(':establishmentGuid')
  async getAllActive(@Param('establishmentGuid') establishmentGuid: string) {
    return this.feedbacksService.findAll(establishmentGuid);
  }

  @UseAuth([Roles.ADMIN])
  @Get(':establishmentGuid/all')
  async getAll(@Param('establishmentGuid') establishmentGuid: string) {
    return this.feedbacksService.findAll(establishmentGuid, true);
  }

  @UseAuth([Roles.ADMIN])
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Request() req: AuthReq,
    @Body() createFeedbackDto: CreateFeedbackDto,
    @UploadedFileImage() image: Express.Multer.File,
  ) {
    const { establishmentUuid } = req.user;

    await this.feedbacksService.create(
      establishmentUuid,
      image,
      createFeedbackDto,
    );

    return;
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':guid/active')
  async setActive(
    @Param('guid') guid: string,
    @Body() { isActive }: { isActive: boolean },
  ) {
    return this.feedbacksService.setActive(guid, isActive);
  }

  @UseAuth([Roles.ADMIN])
  @Patch('positions')
  async setPosition(@Body() { position }: { position: string[] }) {
    return this.feedbacksService.updatePosition(position);
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':guid')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('guid') guid: string,
    @Body() updateCarouselDto: UpdateFeedbackDto,
    @UploadedFileImage(false) image: Express.Multer.File,
  ) {
    return this.feedbacksService.update(guid, updateCarouselDto, image);
  }

  @UseAuth([Roles.ADMIN])
  @Post(':guid')
  async search(
    @Param('guid') guid: string,
    @Body() { search }: { search: string },
  ) {
    return this.feedbacksService.search(guid, search);
  }

  @UseAuth([Roles.ADMIN])
  @Delete(':guid')
  async delete(@Param('guid') guid: string) {
    return this.feedbacksService.remove(guid);
  }
}
