import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/typeOrm/entities/User';

export enum ResponseStatus {
  SUCCESS = 200,
  ERROR = 404,
}
export enum ResponseMessage {
  SUCCESS = 'Requestion successful',
  ERROR = 'Requestion error',
}

export class ResponseData<T> {
  data: T;
  status: HttpStatus;
  message: ResponseMessage;
  constructor(data: T, status: HttpStatus, message: ResponseMessage) {
    this.data = data;
    this.status = status;
    this.message = message;
  }
}

export type CustomRequest = Request & {
  user?: User;
  userId?: number;
};
