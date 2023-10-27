import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ExamParams,
  GetExamParams,
  MakeRandomExamParams,
  MakeRandomQuestionParams,
  submitAnserParams,
} from 'src/interfaces/exam.type';
import { Exam } from 'src/typeOrm/entities/Exam';
import { Question } from 'src/typeOrm/entities/Question';
import { Like, Repository, In } from 'typeorm';
import { RecordService } from '../record/record.service';
import { User } from 'src/typeOrm/entities/User';
import { Record } from 'src/typeOrm/entities/Record';

@Injectable()
export class ExamSevice {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    private recordService: RecordService,
  ) {}

  async getExams(getExamParams: GetExamParams) {
    const exams = await this.examRepository.find({
      where: {
        type: Like(`%${getExamParams.type || ''}%`),
        name: Like(`%${getExamParams.search || ''}%`),
      },
      select: ['id', 'name', 'createdAt', 'type'],
      order: {
        type: 'ASC',
      },
    });

    // exams = exams.map((exam) => ({
    //   ...exam,
    //   questions: JSON.parse(exam.questions),
    // }));
    return exams;
  }

  async makeRamdomExam(makeRandomExamParams: MakeRandomExamParams) {
    // sau khi thêm hết câu hổi thì làm phần này vì cần phải phụ thuộc vào loại câu hỏi với mới cho ra đề thi được

    const questions = await this.makeRandomQuestions({
      type: makeRandomExamParams.type,
    });

    const exam = this.examRepository.create({
      type: makeRandomExamParams.type,
      name: makeRandomExamParams.name,
      questions: JSON.stringify(questions),
      createdAt: new Date().getTime(),
    });

    this.examRepository.save(exam);

    return exam;
  }

  async getExamById(id: number) {
    const exam = await this.examRepository.findOneBy({ id });
    if (!exam)
      throw new HttpException('No Question found', HttpStatus.NOT_FOUND);

    let questionArr = await this.questionRepository.find({
      where: {
        id: In(JSON.parse(exam.questions)),
      },
      select: ['id', 'title', 'image', 'ansers', 'type'],
    });

    questionArr = questionArr.map((question) => {
      return { ...question, ansers: JSON.parse(question.ansers) };
    });

    return {
      ...exam,
      questions: questionArr,
      questionId: JSON.parse(exam.questions),
    };
  }

  async getRandomExam(type: string) {
    const questions = await this.makeRandomQuestions({ type });

    let questionArr = await this.questionRepository.find({
      where: {
        id: In(questions),
      },
      select: ['id', 'title', 'image', 'ansers', 'type'],
    });

    questionArr = questionArr.map((question) => {
      return { ...question, ansers: JSON.parse(question.ansers) };
    });

    return {
      id: 0,
      name: 'Random Test',
      type,
      questions: questionArr,
      questionId: questions,
    };
  }

  async submitAnser(submitAnserParams: submitAnserParams) {
    const score = {
      correct: 0,
      total: 0,
    };
    let isFailAtRequire = false;
    let questionArr = [];

    if (submitAnserParams.examId) {
      const exam = await this.examRepository.findOneBy({
        id: submitAnserParams.examId,
      });
      questionArr = await this.questionRepository.find({
        where: {
          id: In(JSON.parse(exam.questions)),
        },
        select: ['id', 'correct', 'require', 'explain'],
      });
    } else {
      questionArr = await this.questionRepository.find({
        where: {
          id: In(submitAnserParams.questionId),
        },
        select: ['id', 'correct', 'require', 'explain'],
      });
    }

    for (let index = 0; index < submitAnserParams.anser.length; index++) {
      if (submitAnserParams.anser[index] === questionArr[index].correct)
        score.correct += 1;
      else if (questionArr[index].require) {
        isFailAtRequire = true;
      }
      score.total++;
    }

    return {
      questions: questionArr,
      score,
      isFailAtRequire,
    };
  }

  async submitAndSaveAnser(
    submitAnserParams: submitAnserParams,
    userId: number,
  ) {
    const submitRes = await this.submitAnser(submitAnserParams);
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    await this.recordService.createRecord(
      {
        ansers: submitAnserParams.anser,
        examId: submitAnserParams.examId,
        score: submitRes.score,
      },
      user,
    );

    return submitRes;
  }

  async createExam(createExamParams: ExamParams) {
    const newExam = this.examRepository.create({
      type: createExamParams.type,
      name: createExamParams.name,
      questions: JSON.stringify(createExamParams.questions),
      createdAt: new Date().getTime(),
    });

    const exam = await this.examRepository.save(newExam);
    return exam;
  }

  async editExam(editExamParams: ExamParams) {
    if (!editExamParams.id)
      throw new HttpException('Exam not found', HttpStatus.NOT_FOUND);
    const exam = await this.examRepository.findOneBy({
      id: editExamParams.id,
    });
    if (!exam) throw new HttpException('Exam not found', HttpStatus.NOT_FOUND);

    const updateExam = await this.examRepository.update(
      {
        id: editExamParams.id,
      },
      {
        type: editExamParams.type,
        questions: JSON.stringify(editExamParams.questions),
      },
    );
    return updateExam;
  }

  async delExam(id: number) {
    const exam = await this.examRepository.findOneBy({
      id: id,
    });
    if (!exam) throw new HttpException('Exam not found', HttpStatus.NOT_FOUND);

    await this.examRepository.delete(exam);

    const records = await this.recordRepository.find({
      where: {
        exam: exam,
      },
      select: ['id'],
    });
    if (records.length > 0)
      await this.recordRepository.delete({ id: In(records) });
    return 'Deleted';
  }

  async makeRandomQuestions(
    makeRandomQuestionParams: MakeRandomQuestionParams,
  ) {
    const questionFor = ['a1', 'a2', 'a3a4', 'b1'].includes(
      makeRandomQuestionParams.type,
    )
      ? makeRandomQuestionParams.type
      : 'b2cdef';

    const allQuestion = await this.questionRepository.find({
      where: { [questionFor]: true },
    });

    const t1IdList = [];
    const t2IdList = [];
    const t3IdList = [];
    const t4IdList = [];
    const t5IdList = [];
    const t6IdList = [];
    const t7IdList = [];
    const requireIdList = [];

    allQuestion.forEach((item) => {
      if (!item.require) {
        if (item.type === 'T1') t1IdList.push(item.id);
        else if (item.type === 'T2') t2IdList.push(item.id);
        else if (item.type === 'T3') t3IdList.push(item.id);
        else if (item.type === 'T4') t4IdList.push(item.id);
        else if (item.type === 'T5') t5IdList.push(item.id);
        else if (item.type === 'T6') t6IdList.push(item.id);
        else if (item.type === 'T7') t7IdList.push(item.id);
      } else requireIdList.push(item.id);
    });

    let questions: number[] = [];

    if (makeRandomQuestionParams.type) {
      switch (makeRandomQuestionParams.type) {
        case 'a1':
        case 'a2':
        case 'a3a4': {
          questions = [
            ...this.getItemInArray(t1IdList, 8),
            ...this.getItemInArray(t3IdList, 1),
            ...this.getItemInArray(t4IdList, 1),
            ...this.getItemInArray(requireIdList),
            ...this.getItemInArray(t6IdList, 7),
            ...this.getItemInArray(t7IdList, 7),
          ];
          break;
        }

        case 'b1': {
          questions = [
            ...this.getItemInArray(t1IdList, 8),
            ...this.getItemInArray(t3IdList, 1),
            ...this.getItemInArray(t4IdList, 1),
            ...this.getItemInArray(requireIdList),
            ...this.getItemInArray(t5IdList, 1),
            ...this.getItemInArray(t6IdList, 9),
            ...this.getItemInArray(t7IdList, 9),
          ];
          break;
        }
        case 'b2': {
          questions = [
            ...this.getItemInArray(t1IdList, 9),
            ...this.getItemInArray(t2IdList, 1),
            ...this.getItemInArray(t3IdList, 1),
            ...this.getItemInArray(t4IdList, 2),
            ...this.getItemInArray(requireIdList),
            ...this.getItemInArray(t5IdList, 1),
            ...this.getItemInArray(t6IdList, 10),
            ...this.getItemInArray(t7IdList, 10),
          ];
          break;
        }
        case 'c': {
          questions = [
            ...this.getItemInArray(t1IdList, 9),
            ...this.getItemInArray(t2IdList, 1),
            ...this.getItemInArray(t3IdList, 1),
            ...this.getItemInArray(t4IdList, 2),
            ...this.getItemInArray(requireIdList),
            ...this.getItemInArray(t5IdList, 1),
            ...this.getItemInArray(t6IdList, 14),
            ...this.getItemInArray(t7IdList, 11),
          ];
          break;
        }
        default: {
          questions = [
            ...this.getItemInArray(t1IdList, 9),
            ...this.getItemInArray(t2IdList, 1),
            ...this.getItemInArray(t3IdList, 1),
            ...this.getItemInArray(t4IdList, 2),
            ...this.getItemInArray(requireIdList),
            ...this.getItemInArray(t5IdList, 1),
            ...this.getItemInArray(t6IdList, 16),
            ...this.getItemInArray(t7IdList, 14),
          ];
          break;
        }
      }
    } else {
      if (makeRandomQuestionParams.questionNumber) {
        questions = [
          ...this.getItemInArray(
            t1IdList,
            makeRandomQuestionParams.questionNumber.T1 || 0,
          ),
          ...this.getItemInArray(
            t2IdList,
            makeRandomQuestionParams.questionNumber.T2 || 0,
          ),
          ...this.getItemInArray(
            t3IdList,
            makeRandomQuestionParams.questionNumber.T3 || 0,
          ),
          ...this.getItemInArray(
            t4IdList,
            makeRandomQuestionParams.questionNumber.T4 || 0,
          ),
          ...this.getItemInArray(
            requireIdList,
            makeRandomQuestionParams.questionNumber.require || 0,
          ),
          ...this.getItemInArray(
            t5IdList,
            makeRandomQuestionParams.questionNumber.T5 || 0,
          ),
          ...this.getItemInArray(
            t6IdList,
            makeRandomQuestionParams.questionNumber.T6 || 0,
          ),
          ...this.getItemInArray(
            t7IdList,
            makeRandomQuestionParams.questionNumber.T7 || 0,
          ),
        ];
      }
    }
    return questions.sort((a, b) => a - b);
  }

  getItemInArray(array: any[], num?: number) {
    if (num === 0) return [];
    if (num === undefined)
      return [array[Math.floor(Math.random() * array.length)]];
    if (num > 0 && num <= array.length) {
      const tempArr = [...array];
      const result = [];
      for (let i = 0; i < num; i++) {
        const index = Math.floor(Math.random() * tempArr.length);
        result.push(tempArr[index]);

        // only splice array when item is found
        tempArr.splice(index, 1); // 2nd parameter means remove one item only
      }
      return result;
    } else {
      return array[Math.floor(Math.random() * array.length)];
    }
  }
}
