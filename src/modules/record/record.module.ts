import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from 'src/typeOrm/entities/Record';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { Exam } from 'src/typeOrm/entities/Exam';
import { User } from 'src/typeOrm/entities/User';
import { Question } from 'src/typeOrm/entities/Question';

@Module({
  imports: [TypeOrmModule.forFeature([Record, Exam, User, Question])],
  providers: [RecordService],
  controllers: [RecordController],
  exports: [RecordService],
})
export class RecordModule {}
