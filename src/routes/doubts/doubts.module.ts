import { Module } from '@nestjs/common';
import { DoubtsService } from './doubts.service';
import { DoubtsController } from './doubts.controller';

@Module({
  controllers: [DoubtsController],
  providers: [DoubtsService],
})
export class DoubtsModule {}
