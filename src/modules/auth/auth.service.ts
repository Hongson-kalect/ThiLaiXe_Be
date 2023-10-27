import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserSevices } from '../users/user.service';
import {
  ChangePasswordParams,
  RefreshTokenParams,
  SigninParams,
  SignupParams,
} from 'src/interfaces/auth.type';
import { User } from 'src/typeOrm/entities/User';
import { AppJwtService } from '../jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserSevices,
    private appJwtService: AppJwtService,
    // private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signIn(signinParams: SigninParams) {
    const user = await this.userService.findUser(signinParams);

    if (!user) throw new NotFoundException();
    // if (user?.password !== pass) {
    //   throw new UnauthorizedException();
    // }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { password, createdAt, token, refreshToken, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object

    const jwtToken = await this.appJwtService.signToken(
      { id: user.id },
      {
        expiresIn: '1d',
      },
    );
    const jwtRefreshToken = await this.appJwtService.signToken(
      { id: user.id },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '7d',
      },
    );

    user.token = jwtToken;
    user.refreshToken = jwtRefreshToken;
    this.userRepository.save(user);

    return {
      message: 'j ztroi',
      token: jwtToken,
    };
  }

  async signup(signupParams: SignupParams) {
    const user = await this.userRepository.findOne({
      where: [{ email: signupParams.email }],
    });

    if (user)
      throw new HttpException(
        'email or username already used',
        HttpStatus.BAD_REQUEST,
      );

    const saltOrRounds = 10;
    const password = signupParams.password;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const newUser = this.userRepository.create({
      ...signupParams,
      password: hash,
      role: 'member',
      createdAt: new Date().getTime(),
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async changePassword(changePasswordParams: ChangePasswordParams) {
    const user = await this.userService.findUser({
      email: changePasswordParams.email,
      password: changePasswordParams.oldPassword,
    });

    if (!user) throw new NotFoundException();

    const saltOrRounds = 10;
    const password = changePasswordParams.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    user.password = hash;

    return await this.userRepository.save(user);
  }

  async resetPassword(resetPasswordParams: SignupParams) {
    const user = await this.userRepository.findOneBy({
      email: resetPasswordParams.email,
    });

    if (!user) throw new NotFoundException();

    const saltOrRounds = 10;
    const password = resetPasswordParams.password;
    const hash = await bcrypt.hash(password, saltOrRounds);
    user.password = hash;

    return await this.userRepository.save(user);
  }

  async refreshToken(refreshTokenParams: RefreshTokenParams) {
    const user = await this.userRepository.findOne({
      where: {
        token: refreshTokenParams.token,
      },
    });

    if (!user) throw new NotFoundException();

    const tokenValid = await this.appJwtService.verifyToken(user.refreshToken, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });

    if (!tokenValid) throw new HttpException('Refresh token expired', 403);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, createdAt, token, refreshToken, ...result } = user;

    const jwtToken = await this.appJwtService.signToken(result, {
      expiresIn: '1h',
    });

    const jwtRefreshToken = await this.appJwtService.signToken(result, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    });
    user.token = jwtToken;
    user.refreshToken = jwtRefreshToken;
    this.userRepository.save(user);

    return {
      token: jwtToken,
    };
  }
}
