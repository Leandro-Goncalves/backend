import { Order } from '@prisma/client';
import { IsUUID } from 'class-validator';

export class Checkout implements Partial<Order> {
  @IsUUID()
  guid: string;
}
