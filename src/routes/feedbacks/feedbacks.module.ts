import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { ImagesService } from '../images/images.service';
import { S3Service } from '@/services/s3/s3.service';

@Module({
  controllers: [FeedbacksController],
  providers: [FeedbacksService, PrismaService, ImagesService, S3Service],
})
export class FeedbacksModule {}
