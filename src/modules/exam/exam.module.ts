import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from 'src/typeOrm/entities/Exam';
import { ExamSevice } from './exam.service';
import { ExamController } from './exam.controller';
import { Question } from 'src/typeOrm/entities/Question';
import { RecordModule } from '../record/record.module';
import { User } from 'src/typeOrm/entities/User';
import { UserModules } from '../users/user.module';
import { Record } from 'src/typeOrm/entities/Record';

@Module({
  imports: [
    RecordModule,
    UserModules,
    TypeOrmModule.forFeature([Exam, Question, User, Record]),
  ],
  providers: [ExamSevice],
  controllers: [ExamController],
})
export class ExamModule {}
