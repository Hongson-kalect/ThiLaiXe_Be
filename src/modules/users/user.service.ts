import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'src/typeOrm/entities/User';
import {
  CreateUserParams,
  GetUserQueryParams,
  ProfileParams,
} from 'src/interfaces/user.type';
import { SigninParams } from 'src/interfaces/auth.type';
import { Profile } from 'src/typeOrm/entities/Profile';

@Injectable()
export class UserSevices {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async getUser(getUserQuery: GetUserQueryParams) {
    const user = await this.userRepository.find({
      relations: ['profile', 'record'],
      where: [
        {
          email: Like(`%${getUserQuery.search}%`),
          role: Like(`%${getUserQuery.role || ''}%`),
        },
        {
          username: Like(`%${getUserQuery.search}%`),
          role: Like(`%${getUserQuery.role || ''}%`),
        },
      ],
      order: {
        id: 'ASC',
      },
    });
    console.log(user);
    return user;
  }

  async getUserByid(id: number) {
    const user = await this.userRepository.findOne({
      relations: ['profile', 'record', 'record.exam'],
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const res = (({ password, token, refreshToken, ...info }) => info)(user);

    res.record = res.record.map((item) => {
      return {
        ...item,
        examId: item.exam.id,
        examType: item.exam.type,
        ansers: JSON.parse(item.ansers),
        exam: null,
      };
    });
    return res;
  }

  async getUserInfo(id: number) {
    const user = await this.userRepository.findOne({
      // relations: ['profile', 'record'],
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException();
    delete user.password;
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });

    return user;
  }

  async findUser(signInParams: SigninParams) {
    const user = await this.userRepository.findOne({
      where: {
        email: signInParams.email,
      },
    });

    console.log(user);

    if (!user) return null;
    const isMatch = await bcrypt.compare(signInParams.password, user.password);
    if (isMatch) return user;
    return null;
  }

  async createUser(createUserParams: CreateUserParams) {
    const user = await this.userRepository.findOne({
      where: { email: createUserParams.email },
    });

    console.log('có vàod đây ko trời');

    if (user)
      throw new HttpException(
        'email or username already used',
        HttpStatus.BAD_REQUEST,
      );

    const saltOrRounds = 10;
    const password = createUserParams.password;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const newUser = this.userRepository.create({
      ...createUserParams,
      password: hash,
      createdAt: new Date().getTime(),
    });
    await this.userRepository.save(newUser);
    return newUser;
  }

  async deleteUser(id: number, userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (!(user?.role !== 'admin'))
      throw new HttpException('Not have permission', HttpStatus.BAD_REQUEST);

    const targetUser = await this.userRepository.findOneBy({
      id: id,
    });

    if (!(targetUser?.role === 'admin'))
      throw new HttpException('Not have permission', HttpStatus.BAD_REQUEST);

    return await this.userRepository.softDelete(targetUser);
  }

  async createProfile(createProfileParams: ProfileParams, userId: number) {
    const user = await this.userRepository.findOne({
      relations: ['profile'],
      where: { id: userId },
    });
    user.username = createProfileParams.username;

    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

    const profile = await this.profileRepository.findOneBy({
      id: user.profile?.id || -1,
    });
    if (profile) {
      profile.firstName = createProfileParams.firstName;
      profile.lastName = createProfileParams.lastName;
      profile.date_of_birth = createProfileParams.date_of_birth;
      profile.place_of_birth = createProfileParams.place_of_birth;
      profile.phone = createProfileParams.phone;
      profile.address = createProfileParams.address;

      this.profileRepository.save(profile);

      user.username = createProfileParams.username;
      this.userRepository.save(user);
    } else {
      const newProfile = this.profileRepository.create({
        firstName: createProfileParams?.firstName || '',
        lastName: createProfileParams?.lastName || '',
        date_of_birth: createProfileParams?.date_of_birth || '',
        place_of_birth: createProfileParams?.place_of_birth || '',
        phone: createProfileParams?.phone || '',
        address: createProfileParams?.address || '',
      });

      user.username = createProfileParams.username;
      user.profile = newProfile;
      this.userRepository.save(user);
      this.profileRepository.save(newProfile);
    }

    return 'success';
  }

  async editProfile(editProfileParams: ProfileParams, tokenInfo: User) {
    const user = await this.userRepository.findOneBy({ id: tokenInfo.id });
    if (!user)
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

    const profile = await this.profileRepository.update(
      {
        id: tokenInfo.id,
      },

      editProfileParams,
    );
    return profile;
  }
}
