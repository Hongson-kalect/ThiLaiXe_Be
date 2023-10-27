import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModules } from './modules/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { QuestionModule } from './modules/questions/question.module';
import { ExamModule } from './modules/exam/exam.module';

import { User } from './typeOrm/entities/User';
import { Profile } from './typeOrm/entities/Profile';
import { Question } from './typeOrm/entities/Question';
import { Record } from './typeOrm/entities/Record';
import { Exam } from './typeOrm/entities/Exam';
import { Code } from './typeOrm/entities/Code';
import { MailModule } from './modules/mail/mail.module';
import { ConfirmModule } from './modules/confirm/confirm.module';
import { Confirm } from './typeOrm/entities/Confirm';
import { MarkdownModule } from './modules/markdown/markdown.module';
import { Markdown } from './typeOrm/entities/Markdown';

@Module({
  imports: [
    UserModules,
    AuthModule,
    QuestionModule,
    ExamModule,
    MailModule,
    ConfirmModule,
    MarkdownModule,

    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: '',
    //   database: 'thi_lai_xe',
    //   entities: [
    //     User,
    //     Profile,
    //     Question,
    //     Code,
    //     Record,
    //     Exam,
    //     Confirm,
    //     Markdown,
    //   ],
    //   synchronize: true,
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'db.usfzmufeuhsmuzsvqljs.supabase.co',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'Hongson01!!',
    //   database: 'postgres',
    //   entities: [
    //     User,
    //     Profile,
    //     Question,
    //     Code,
    //     Record,
    //     Exam,
    //     Confirm,
    //     Markdown,
    //   ],
    //   synchronize: true,
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DATABASE_HOST,
    //   port: Number(process.env.DATABASE_PORT) || 3306,
    //   username: process.env.DATABASE_USERNAME,
    //   password: process.env.DATABASE_PASSWORD,
    //   database: process.env.DATABASE_NAME,
    //   entities: [
    //     User,
    //     Profile,
    //     Question,
    //     Code,
    //     Record,
    //     Exam,
    //     Confirm,
    //     Markdown,
    //   ],
    //   synchronize: true,
    // }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT) || 3306,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [
          User,
          Profile,
          Question,
          Code,
          Record,
          Exam,
          Confirm,
          Markdown,
        ],
        synchronize: true,
      }),
    }),

    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
