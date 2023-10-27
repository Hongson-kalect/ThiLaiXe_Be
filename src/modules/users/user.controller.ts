import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Body,
  Query,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { UserSevices } from './user.service';
import {
  CustomRequest,
  ResponseData,
  ResponseMessage,
} from 'src/interfaces/global.type';
import {
  ProfileDto,
  CreateUserDto,
  GetUserQueryDto,
} from '../../typedto/user.dto';
import { Public } from '../auth/guard.metadata';

@Controller('user')
export class UserController {
  constructor(private userServices: UserSevices) {}

  @Get()
  async getUser(@Query() getUserQuery: GetUserQueryDto) {
    try {
      return new ResponseData(
        await this.userServices.getUser(getUserQuery),
        HttpStatus.OK,
        ResponseMessage.SUCCESS,
      );
    } catch (error) {
      throw new HttpException(ResponseMessage.ERROR, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('info')
  async getUserInfo(@Request() { userId }: CustomRequest) {
    try {
      return new ResponseData(
        await this.userServices.getUserInfo(userId),
        HttpStatus.OK,
        ResponseMessage.SUCCESS,
      );
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    try {
      return new ResponseData(
        await this.userServices.getUserByid(id),
        HttpStatus.OK,
        ResponseMessage.SUCCESS,
      );
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    try {
      return new ResponseData(
        await this.userServices.createUser(user),
        HttpStatus.OK,
        ResponseMessage.SUCCESS,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/:id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Request() { userId }: CustomRequest,
  ) {
    return new ResponseData(
      await this.userServices.deleteUser(id, userId),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Post('/profile')
  async createProfile(
    @Body() createProfileDto: ProfileDto,
    @Request() { userId }: CustomRequest,
  ) {
    return new ResponseData(
      await this.userServices.createProfile(createProfileDto, userId),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }
  @Put('/profile')
  async editProfile(@Body() editProfileDto: ProfileDto, @Request() req) {
    return new ResponseData(
      await this.userServices.editProfile(editProfileDto, req),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }
}
