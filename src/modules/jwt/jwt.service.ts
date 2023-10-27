import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppJwtService {
  constructor(private jwtService: JwtService) {}

  verifyToken = async (token: string, options?: { secret?: string }) => {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: options.secret || process.env.ACCESS_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException();
    }
  };

  signToken = async (
    params: any,
    options?: { secret?: string; expiresIn?: string },
  ) => {
    return await this.jwtService.signAsync(params, {
      secret: options?.secret || process.env.ACCESS_TOKEN_SECRET,
      expiresIn: options?.expiresIn || '1h',
    });
  };
}
