import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  Request,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { GetRecordsParams } from 'src/interfaces/record.type';
import {
  CustomRequest,
  ResponseData,
  ResponseMessage,
} from 'src/interfaces/global.type';

@Controller('record')
export class RecordController {
  constructor(private recordService: RecordService) {}

  @Get()
  async getRecords(
    @Query() getRecordsParams: GetRecordsParams,
    @Request() { userId }: CustomRequest,
  ) {
    return new ResponseData(
      await this.recordService.getRecords(getRecordsParams, userId),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Get(':id')
  async getRecordById(
    @Param('id', ParseIntPipe) id: number,
    @Request() { userId }: CustomRequest,
  ) {
    return new ResponseData(
      await this.recordService.getRecordById(id, userId),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  // @Post()
  // async createRecord(
  //   @Body() createRecordDto: RecordDto,
  //   @Request() req: CustomRequest,
  // ) {
  //   return new ResponseData(
  //     await this.recordService.createRecord(createRecordDto, req.user),
  //     HttpStatus.OK,
  //     ResponseMessage.SUCCESS,
  //   );
  // }

  @Delete()
  async deleteRecord(@Param('id', ParseIntPipe) id: number) {
    return new ResponseData(
      await this.recordService.delRecord(id),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }
}
