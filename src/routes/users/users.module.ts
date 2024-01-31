import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { BullModule } from '@nestjs/bull';
import { BrevoService } from '@/services/brevo/brevo.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'email-job' })],
  controllers: [UsersController],
  providers: [UsersService, BcryptService, BrevoService],
})
export class UsersModule {}
