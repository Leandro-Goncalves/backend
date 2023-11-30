import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Errors } from '../errors';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UseAuth } from './roles.decorator';
import { Roles } from '@/routes/users/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const roles = this.reflector.get(UseAuth, context.getHandler());
    if (!roles) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw Errors.UnauthorizedUser;
    }

    try {
      const payload = this.jwtService.verify(token);

      if (roles && !this.isRulesValid(roles, payload.role)) {
        return false;
      }

      request['user'] = payload;
    } catch (e) {
      console.log(e);
      throw Errors.UnauthorizedUser;
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isRulesValid(rules: Roles[], userRules: Roles[]): boolean {
    return rules.every((rule) => userRules.includes(rule));
  }
}
