import { Roles as RolesType } from '@/routes/users/entities/user.entity';
import { Reflector } from '@nestjs/core';

export const UseAuth = Reflector.createDecorator<RolesType[]>();
