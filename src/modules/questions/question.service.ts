import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GetQuestionsParams,
  QuestionParam,
} from 'src/interfaces/question.type';
import { Exam } from 'src/typeOrm/entities/Exam';
import { Question } from 'src/typeOrm/entities/Question';
import { Record } from 'src/typeOrm/entities/Record';
import constain from 'src/utils/constain';
import { In, Like, Repository } from 'typeorm';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Question)
    private examRepository: Repository<Exam>,
    @InjectRepository(Question)
    private recordRepository: Repository<Record>,
  ) {}

  async getQuestions(getQuestionsParams: GetQuestionsParams) {
    const questionFor = ['a2', 'a34', 'b1', 'b2cdef'].includes(
      getQuestionsParams.for,
    )
      ? getQuestionsParams.for
      : ['b2', 'c', 'd', 'e', 'f', 'def', 'b2cdef'].includes(
          getQuestionsParams.for,
        )
      ? 'b2cdef'
      : 'a1';
    let questions: Question[];
    let questionCount: number;
    const whereObt = {
      title: Like(`%${getQuestionsParams.search || ''}%`),
      [questionFor]: true,
      type: Like(`%${getQuestionsParams.type || ''}`),
    };
    if (getQuestionsParams.require !== undefined) {
      whereObt.require = getQuestionsParams.require === 'true' ? true : false;
    }

    if (getQuestionsParams.getAll) {
      questions = await this.questionRepository.find({
        where: whereObt,
      });

      questionCount = questions.length;
    } else {
      questions = await this.questionRepository.find({
        where: whereObt,
        take: constain.NUMBER_PER_PAGE,
        skip: ((getQuestionsParams.page || 1) - 1) * constain.NUMBER_PER_PAGE,
      });

      questionCount = await this.questionRepository.count({
        where: whereObt,
      });
    }

    questions = questions.map((question) => ({
      ...question,
      ansers: JSON.parse(question.ansers),
    }));

    return { questions, total: questionCount };
  }

  async getQuestionById(id: number) {
    const question = await this.questionRepository.findOneBy({ id });
    if (!question)
      throw new HttpException('No Question found', HttpStatus.NOT_FOUND);

    return { ...question, ansers: JSON.parse(question.ansers) };
  }

  async createQuestion(createQuestionParams: QuestionParam) {
    const newQuestion = this.questionRepository.create({
      ...createQuestionParams,
      ansers: JSON.stringify(createQuestionParams.ansers),
      createdAt: new Date().getTime(),
    });

    const question = await this.questionRepository.save(newQuestion);
    return question;
  }

  async editQuestion(id: number, editQuestionParams: QuestionParam) {
    if (!id)
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    const question = await this.questionRepository.findOneBy({
      id: id,
    });
    if (!question)
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);

    const newQuestion = await this.questionRepository.update(
      {
        id: id,
      },
      {
        ...editQuestionParams,
        ansers: JSON.stringify(editQuestionParams.ansers),
      },
    );
    return newQuestion;
  }

  async delQuestion(id: number) {
    const question = await this.questionRepository.findOneBy({
      id: id,
    });
    if (!question)
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
    await this.questionRepository.delete(question);

    const exams = await this.examRepository.find({
      where: [
        {
          questions: Like('%,' + id + ',%'),
        },
        {
          questions: Like('%[' + id + ',%'),
        },
        {
          questions: Like('%,' + id + ']%'),
        },
      ],
      select: ['id'],
    });
    if (exams.length > 0) {
      await this.questionRepository.delete({ id: In(exams) });

      const records = await this.recordRepository.find({
        where: {
          exam: In(exams),
        },
        select: ['id'],
      });

      if (records.length > 0)
        await this.recordRepository.delete({ id: In(records) });
    }

    return 'Deleted';
  }

  async addImage(body: { id: number; image: string }) {
    const question = await this.questionRepository.findOneBy({
      id: body.id,
    });
    if (!question)
      throw new HttpException('Question not found', HttpStatus.NOT_FOUND);

    await this.questionRepository.update(
      {
        id: body.id,
      },
      {
        image: body.image,
      },
    );
    return 'updated';
  }
}
