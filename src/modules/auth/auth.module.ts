import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModules } from '../users/user.module';
// import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeOrm/entities/User';
import { AppJwtModule } from '../jwt/jwt.module';

// const jwtConfig: JwtModuleAsyncOptions = {
//   useFactory: () => {
//     return {
//       global: true,
//     };
//   },
// };

@Module({
  imports: [
    UserModules,
    // JwtModule.register(jwtConfig),
    AppJwtModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
