import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserSevices } from './user.service';
import { User } from 'src/typeOrm/entities/User';
import { Profile } from 'src/typeOrm/entities/Profile';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UserController],
  providers: [UserSevices],
  exports: [UserSevices],
})
export class UserModules {}
