import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DoubtsService } from './doubts.service';
import { CreateDoubtDto } from './dto/create-doubt.dto';
import { UpdateDoubtDto } from './dto/update-doubt.dto';
import { UseAuth } from '@/auth/roles.decorator';
import { Roles } from '../users/entities/user.entity';

@Controller('doubts')
export class DoubtsController {
  constructor(private readonly doubtsService: DoubtsService) {}

  @UseAuth([Roles.ADMIN])
  @Post()
  create(@Body() createDoubtDto: CreateDoubtDto) {
    return this.doubtsService.create(createDoubtDto);
  }

  @Get()
  findAll() {
    return this.doubtsService.findAll();
  }

  @Get(':guid')
  findOne(@Param('guid') guid: string) {
    return this.doubtsService.findOne(guid);
  }

  @UseAuth([Roles.ADMIN])
  @Patch('position')
  updatePosition(@Body() { position }: { position: string[] }) {
    return this.doubtsService.updatePosition(position);
  }

  @UseAuth([Roles.ADMIN])
  @Patch(':guid')
  update(@Param('guid') guid: string, @Body() updateDoubtDto: UpdateDoubtDto) {
    return this.doubtsService.update(guid, updateDoubtDto);
  }

  @UseAuth([Roles.ADMIN])
  @Delete(':guid')
  remove(@Param('guid') guid: string) {
    return this.doubtsService.remove(guid);
  }
}
