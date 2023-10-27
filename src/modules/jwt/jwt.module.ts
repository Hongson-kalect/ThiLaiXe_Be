import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { AppJwtService } from './jwt.service';

const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: () => {
    return {
      global: true,
    };
  },
};

@Module({
  imports: [JwtModule.register(jwtConfig)],
  providers: [AppJwtService],
  exports: [AppJwtService],
})
export class AppJwtModule {}
