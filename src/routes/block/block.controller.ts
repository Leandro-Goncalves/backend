import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { UseAuth } from '@/auth/roles.decorator';
import { Roles } from '../users/entities/user.entity';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @UseAuth([Roles.ADMIN])
  @Post()
  create(@Body() createBlockDto: CreateBlockDto) {
    return this.blockService.create(createBlockDto);
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
  update(@Param('guid') guid: string, @Body() updateBlockDto: UpdateBlockDto) {
    return this.blockService.update(guid, updateBlockDto);
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
