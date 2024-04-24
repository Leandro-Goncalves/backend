import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { FabricsService } from './fabrics.service';
import { CreateFabricDto } from './dto/create-fabric.dto';
import { UpdateFabricDto } from './dto/update-fabric.dto';
import { Roles } from '../users/entities/user.entity';
import { UseAuth } from '@/auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFileImage } from '@/utils/UploadedFileImage';

@Controller('fabrics')
export class FabricsController {
  constructor(private readonly fabricsService: FabricsService) {}

  @UseAuth([Roles.ADMIN])
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createFabricDto: CreateFabricDto,
    @UploadedFileImage() image: Express.Multer.File,
  ) {
    return this.fabricsService.create(image, createFabricDto);
  }

  @UseAuth([Roles.ADMIN])
  @Get('all')
  findAll() {
    return this.fabricsService.findAll(true);
  }

  @Get()
  findAllActive() {
    return this.fabricsService.findAll();
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':guid/active')
  async setActive(
    @Param('guid') guid: string,
    @Body() { isActive }: { isActive: boolean },
  ) {
    return this.fabricsService.setActive(guid, isActive);
  }

  @UseAuth([Roles.ADMIN])
  @Patch('position')
  updatePosition(@Body() { position }: { position: string[] }) {
    return this.fabricsService.updatePosition(position);
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':guid')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('guid') guid: string,
    @Body() updateFabricDto: UpdateFabricDto,
    @UploadedFileImage(false) image: Express.Multer.File,
  ) {
    return this.fabricsService.update(guid, updateFabricDto, image);
  }

  @UseAuth([Roles.ADMIN])
  @Delete(':guid')
  remove(@Param('guid') guid: string) {
    return this.fabricsService.remove(guid);
  }
}
