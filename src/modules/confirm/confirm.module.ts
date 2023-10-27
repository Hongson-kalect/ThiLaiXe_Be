import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Confirm } from 'src/typeOrm/entities/Confirm';
import { ConfirmService } from './confirm.service';
import { AppJwtModule } from '../jwt/jwt.module';
import { ConfirmController } from './confirm.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Confirm]), AppJwtModule],
  providers: [ConfirmService],
  controllers: [ConfirmController],
  exports: [ConfirmService],
})
export class ConfirmModule {}
