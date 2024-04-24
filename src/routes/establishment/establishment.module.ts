import { Module } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { EstablishmentController } from './establishment.controller';
import { ImagesService } from '../images/images.service';
import { S3Service } from '@/services/s3/s3.service';

@Module({
  controllers: [EstablishmentController],
  providers: [EstablishmentService, ImagesService, S3Service],
})
export class EstablishmentModule {}
