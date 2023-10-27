import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ResponseData, ResponseMessage } from 'src/interfaces/global.type';
import { Public } from '../auth/guard.metadata';
import { MailerType } from 'src/interfaces/confirm.type';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Public()
  @Post('sign-up')
  async signUpMailer(@Body() mailDto: MailerType) {
    return new ResponseData(
      await this.mailService.mailer({ ...mailDto, template: 'signIn' }),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Public()
  @Post('reset-password')
  async resetPasswordMailer(@Body() mailDto: MailerType) {
    return new ResponseData(
      await this.mailService.mailer({ ...mailDto, template: 'resetPassword' }),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }
}
