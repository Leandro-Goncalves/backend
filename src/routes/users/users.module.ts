import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { BullModule } from '@nestjs/bull';
import { EmailJob } from 'src/jobs/email.job';

@Module({
  imports: [BullModule.registerQueue({ name: 'email-job' })],
  controllers: [UsersController],
  providers: [UsersService, BcryptService, EmailJob],
})
export class UsersModule {}
