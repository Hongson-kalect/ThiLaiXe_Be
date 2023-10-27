import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GetRecordsParams,
  createRecordParams,
} from 'src/interfaces/record.type';
import { Record } from 'src/typeOrm/entities/Record';
import { User } from 'src/typeOrm/entities/User';
import { In, Repository } from 'typeorm';
import { Exam } from 'src/typeOrm/entities/Exam';
import { Question } from 'src/typeOrm/entities/Question';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async getRecords(getRecordsParams: GetRecordsParams, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);

    let records = await this.recordRepository.find({
      relations: ['user', 'exam'],
      where: {
        user: user,
      },
    });

    records = records.map((record) => ({
      ...record,
      ansers: JSON.parse(record.ansers),
    }));

    return records;
  }

  async getRecordById(id: number, userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);

    const record = await this.recordRepository.findOne({
      relations: ['user', 'exam'],
      where: {
        id: id,
      },
    });

    if (!record)
      throw new HttpException('No Record found', HttpStatus.NOT_FOUND);

    const questionId: number[] = JSON.parse(record.exam.questions);

    let questions = await this.questionRepository.find({
      where: { id: In(questionId) },
    });
    questions = questions.map((item) => {
      return { ...item, ansers: JSON.parse(item.ansers) };
    });

    return { ...record, ansers: JSON.parse(record.ansers), questions };
  }

  async createRecord(createRecordParams: createRecordParams, user: User) {
    const exam = await this.examRepository.findOneBy({
      id: createRecordParams.examId,
    });

    console.log(exam);
    console.log(createRecordParams.examId);
    if (!exam) throw new HttpException('No exam found', HttpStatus.NOT_FOUND);

    // const newRecord = this.recordRepository.create({
    //   ansers: JSON.stringify(createRecordParams.ansers),
    //   score: Math.floor((score * 1000) / total) / 100,
    //   createdAt: new Date().getTime(),
    //   user: tokenInfo,
    //   exam: exam,
    // });

    const newRecord = this.recordRepository.create({
      ansers: JSON.stringify(createRecordParams.ansers),
      score:
        Math.floor(
          (createRecordParams.score.correct * 1000) /
            createRecordParams.score.total,
        ) / 100,
      createdAt: new Date().getTime(),
      user: user,
      exam: exam,
    });

    this.recordRepository.save(newRecord);

    return;
  }

  // async editRecord(editRecordParams: RecordParams) {
  //   if (!editRecordParams.id)
  //     throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
  //   const record = await this.recordRepository.findOneBy({
  //     id: editRecordParams.id,
  //   });
  //   if (!record)
  //     throw new HttpException('Record not found', HttpStatus.NOT_FOUND);

  //   const newRecord = await this.recordRepository.update(
  //     {
  //       id: editRecordParams.id,
  //     },
  //     {
  //       ...editRecordParams,
  //       ansers: JSON.stringify(editRecordParams.ansers),
  //     },
  //   );
  //   return newRecord;
  // }

  async delRecord(id: number) {
    const record = await this.recordRepository.findOneBy({
      id: id,
    });
    if (!record)
      throw new HttpException('Record not found', HttpStatus.NOT_FOUND);

    await this.recordRepository.delete(record);
    return 'Deleted';
  }
}
