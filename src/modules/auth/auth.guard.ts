import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './guard.metadata';
import { AppJwtService } from '../jwt/jwt.service';
import { UserSevices } from '../users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private appJwtService: AppJwtService,
    private userService: UserSevices,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: { id: number } = await this.appJwtService.verifyToken(
        token,
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
        },
      );

      const user = payload.id;

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['userId'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
