import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/typeOrm/entities/Question';
import { Exam } from 'src/typeOrm/entities/Exam';
import { Record } from 'src/typeOrm/entities/Record';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Exam, Record])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
