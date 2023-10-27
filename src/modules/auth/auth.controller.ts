import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './guard.metadata';
import {
  ChangePasswordDto,
  RefreshTokenDto,
  SigninDto,
  SignupDto,
} from 'src/typedto/auth.dto';
import { ResponseData, ResponseMessage } from 'src/interfaces/global.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('sign-in')
  async signIn(@Body() signInDto: SigninDto) {
    return new ResponseData(
      await this.authService.signIn(signInDto),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Public()
  @Post('sign-up')
  async signup(@Body() signupDto: SignupDto) {
    return new ResponseData(
      await this.authService.signup(signupDto),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Public()
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return new ResponseData(
      await this.authService.changePassword(changePasswordDto),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: SignupDto) {
    return new ResponseData(
      await this.authService.resetPassword(resetPasswordDto),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }

  @Get('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return new ResponseData(
      await this.authService.refreshToken(refreshTokenDto),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }
}
