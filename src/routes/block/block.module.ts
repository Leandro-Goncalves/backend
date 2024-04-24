import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { S3Service } from '@/services/s3/s3.service';
import { ImagesService } from '../images/images.service';

@Module({
  controllers: [BlockController],
  providers: [BlockService, ImagesService, S3Service],
})
export class BlockModule {}
