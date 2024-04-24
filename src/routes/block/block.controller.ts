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
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { UseAuth } from '@/auth/roles.decorator';
import { Roles } from '../users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFileImage } from '@/utils/UploadedFileImage';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @UseAuth([Roles.ADMIN])
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @Body() createBlockDto: CreateBlockDto,
    @UploadedFileImage() image: Express.Multer.File,
  ) {
    return this.blockService.create(image, createBlockDto);
  }

  @Get('/active')
  getActive() {
    return this.blockService.active();
  }

  @UseAuth([Roles.ADMIN])
  @Get()
  findAll() {
    return this.blockService.findAll();
  }

  @UseAuth([Roles.ADMIN])
  @Patch('position')
  updatePosition(@Body() { position }: { position: string[] }) {
    console.log(position);
    return this.blockService.updatePosition(position);
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':guid')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('guid') guid: string,
    @Body() updateBlockDto: UpdateBlockDto,
    @UploadedFileImage(false) image: Express.Multer.File,
  ) {
    return this.blockService.update(guid, updateBlockDto, image);
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':guid/active')
  setActive(
    @Param('guid') guid: string,
    @Body() { isActive }: { isActive: boolean },
  ) {
    return this.blockService.setActive(guid, isActive);
  }

  @UseAuth([Roles.ADMIN])
  @Delete(':guid')
  remove(@Param('guid') guid: string) {
    return this.blockService.remove(guid);
  }
}
