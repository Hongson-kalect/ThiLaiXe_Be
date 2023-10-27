import { HttpException, HttpStatus } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserSevices } from '../users/user.service';
import { ConfirmService } from '../confirm/confirm.service';
import { MailerType } from 'src/interfaces/confirm.type';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly userServices: UserSevices,
    private readonly confirmService: ConfirmService,
  ) {}

  async mailer({ email, type, template }: MailerType) {
    let isSuccess = false;
    const validateNumber = Math.floor(10000 + Math.random() * 90000);
    console.log(validateNumber);

    const user = await this.userServices.getUserByEmail(email);
    if (template === 'signUp') {
      if (user)
        throw new HttpException('Tài khoản đã tồn tại', HttpStatus.CONFLICT);
    } else if (template === 'resetPassword') {
      if (!user)
        throw new HttpException(
          'Tài khoản không tồn tại',
          HttpStatus.NOT_FOUND,
        );
    }

    await this.mailerService
      .sendMail({
        to: email, // sender address
        from: process.env.EMAIL_HOST, // list of receivers
        subject: 'Xác nhận tài khoản',
        template: template ? './' + template : './signIn', // Subject line
        context: {
          email,
          validateNumber,
        },
      })
      .then(() => {
        isSuccess = true;
      })
      .catch((error: any) => {
        console.log(error);
        throw new HttpException('Error', HttpStatus.BAD_REQUEST);
      });

    await this.confirmService.createConfirm({
      email,
      type,
      value: validateNumber.toString(),
    });

    return isSuccess;
  }
}
