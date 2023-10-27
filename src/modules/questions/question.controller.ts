import {
  Controller,
  Query,
  Param,
  Body,
  Get,
  Post,
  Delete,
  Put,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { ResponseData, ResponseMessage } from 'src/interfaces/global.type';
import { GetQuestionsDto, QuestionDto } from 'src/typedto/question.dto';
import { Public } from '../auth/guard.metadata';

@Controller('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Public()
  @Get()
  async getQuestions(@Query() getQuestionsParams: GetQuestionsDto) {
    return new ResponseData(
      await this.questionService.getQuestions(getQuestionsParams),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Get(':id')
  async getQuestionById(@Param('id', ParseIntPipe) id: number) {
    return new ResponseData(
      await this.questionService.getQuestionById(id),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Public()
  @Post()
  async createQuestion(@Body() createQuestionDto: QuestionDto) {
    return new ResponseData(
      await this.questionService.createQuestion(createQuestionDto),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }
  @Put(':id')
  async editQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() editQuestionDto: QuestionDto,
  ) {
    return new ResponseData(
      await this.questionService.editQuestion(id, editQuestionDto),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Public()
  @Post('add-image')
  async addImage(@Body() body: any) {
    return new ResponseData(
      await this.questionService.addImage(body),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Delete()
  async deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return new ResponseData(
      await this.questionService.delQuestion(id),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }
}
