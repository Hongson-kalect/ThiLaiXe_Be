import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ExamSevice } from './exam.service';
import {
  ExamDto,
  GetExamDto,
  MakeRandomExamDto,
  submitExamDto,
} from 'src/typedto/exam.dto';
import {
  CustomRequest,
  ResponseData,
  ResponseMessage,
} from 'src/interfaces/global.type';
import { Public } from '../auth/guard.metadata';

@Controller('exam')
export class ExamController {
  constructor(private examService: ExamSevice) {}

  @Public()
  @Get()
  async getExams(@Query() getExamsDto: GetExamDto) {
    return new ResponseData(
      await this.examService.getExams(getExamsDto),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  // @Public()
  @Post('ramdom')
  async makeRamdomExam(@Body() makeRandomExamDto: MakeRandomExamDto) {
    return new ResponseData(
      await this.examService.makeRamdomExam(makeRandomExamDto),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Public()
  @Get(':id')
  async getExamById(@Param('id', ParseIntPipe) id: number) {
    return new ResponseData(
      await this.examService.getExamById(id),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Public()
  @Get(':type/random')
  async getExamRandom(@Param('type') type: string) {
    return new ResponseData(
      await this.examService.getRandomExam(type),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Public()
  @Post('/submit')
  async submitAnser(@Body() body: submitExamDto) {
    return new ResponseData(
      // await this.examService.getExamById(id),
      await this.examService.submitAnser(body),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Post('/submit/save')
  async submitAndSaveAnser(
    @Body() body: submitExamDto,
    @Request() { userId }: CustomRequest,
  ) {
    return new ResponseData(
      // await this.examService.getExamById(id),
      await this.examService.submitAndSaveAnser(body, userId),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Public()
  @Post()
  async createExam(@Body() createExamDto: ExamDto) {
    return new ResponseData(
      await this.examService.createExam(createExamDto),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }
  @Put()
  async editExam(@Body() editExamDto: ExamDto) {
    return new ResponseData(
      await this.examService.editExam(editExamDto),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Delete()
  async deleteExam(@Param('id', ParseIntPipe) id: number) {
    return new ResponseData(
      await this.examService.delExam(id),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }
}
