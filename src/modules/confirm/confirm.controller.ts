import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../auth/guard.metadata';
import { ConfirmService } from './confirm.service';
import { VerifyDto } from 'src/typedto/confirm.dto';
import { ResponseData, ResponseMessage } from 'src/interfaces/global.type';

@Controller('confirm')
export class ConfirmController {
  constructor(private confirmService: ConfirmService) {}

  @Public()
  @Post()
  async verify(@Body() verifyDto: VerifyDto) {
    return new ResponseData(
      await this.confirmService.verifyConfirm(verifyDto),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }
}
