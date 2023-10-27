import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Confirm } from 'src/typeOrm/entities/Confirm';
import { In, LessThan, MoreThan, Repository } from 'typeorm';
import { AppJwtService } from '../jwt/jwt.service';
import { VerifyParams } from 'src/interfaces/confirm.type';

@Injectable()
export class ConfirmService {
  constructor(
    @InjectRepository(Confirm) private confirmRepository: Repository<Confirm>,
    private appJwtService: AppJwtService,
  ) {}

  createConfirm = async (createConfirm: VerifyParams) => {
    await this.deleteOldConfirm();
    await this.deleteOldUserConfirm(createConfirm.email, createConfirm.type);

    const newConfirm = this.confirmRepository.create({
      email: createConfirm.email,
      type: createConfirm.type,
      value: createConfirm.value,
      createdAt: new Date().getTime(),
    });
    this.confirmRepository.save(newConfirm);
  };

  verifyConfirm = async (verifyParams: VerifyParams) => {
    const hourago = new Date(new Date().getTime() - 1000 * 60 * 60).getTime();
    const confirm = await this.confirmRepository.findOneBy({
      email: verifyParams.email,
      type: verifyParams.type,
      value: verifyParams.value,
      createdAt: MoreThan(hourago),
    });

    if (!confirm) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    } else {
      this.confirmRepository.delete(confirm);
      return true;
    }
  };

  deleteOldConfirm = async () => {
    const hourago = new Date(new Date().getTime() - 1000 * 60 * 60).getTime();
    const experiodRow = await this.confirmRepository.find({
      where: {
        createdAt: LessThan(hourago),
      },
      select: ['id'],
    });

    const idList = experiodRow.map((item) => item.id);

    this.confirmRepository.delete({ id: In(idList) });
  };

  deleteOldUserConfirm = async (email: string, type: string) => {
    const experiodRow = await this.confirmRepository.find({
      where: {
        email: email,
        type: type,
      },
      select: ['id'],
    });

    if (experiodRow?.length > 0) {
      const idList = experiodRow.map((item) => item.id);
      this.confirmRepository.delete({ id: In(idList) });
    }
  };
}
