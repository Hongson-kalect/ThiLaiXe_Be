import { Module } from '@nestjs/common';
// import { BullModule } from 'nest-bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { mailBullConfig } from '../../config/mail';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
// import { UserSevices } from '../users/user.service';
import { UserModules } from '../users/user.module';
import { ConfirmModule } from '../confirm/confirm.module';
// import { MailQueue } from './mail.queue';

// const bullModule = BullModule.forRoot(mailBullConfig);

@Module({
  imports: [
    UserModules,
    ConfirmModule,
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAILER_HOST,
          auth: {
            user: process.env.EMAIL_HOST,
            pass: process.env.EMAIL_HOST_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: 'Luyện thi lý thuyết',
        },
        template: {
          dir: 'src/templates/email',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
