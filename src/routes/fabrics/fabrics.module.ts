import { Module } from '@nestjs/common';
import { FabricsService } from './fabrics.service';
import { FabricsController } from './fabrics.controller';
import { ImagesService } from '../images/images.service';
import { S3Service } from '@/services/s3/s3.service';

@Module({
  controllers: [FabricsController],
  providers: [FabricsService, ImagesService, S3Service],
})
export class FabricsModule {}
