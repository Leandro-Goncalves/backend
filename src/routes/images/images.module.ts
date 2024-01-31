import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { S3Service } from '@/services/s3/s3.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, S3Service],
})
export class ImagesModule {}
