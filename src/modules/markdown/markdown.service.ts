import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Markdown } from 'src/typeOrm/entities/Markdown';
import { Repository } from 'typeorm';

@Injectable()
export class MarkdownService {
  constructor(
    @InjectRepository(Markdown)
    private markdownRepository: Repository<Markdown>,
  ) {}

  getTip = async () => {
    const tip = await this.markdownRepository.findOneBy({ code: 'tip' });
    if (!tip) throw new HttpException('Not found tip', HttpStatus.NOT_FOUND);
    return tip;
  };

  postTip = async (value: string) => {
    const tip = await this.markdownRepository.findOneBy({ code: 'tip' });
    if (!tip) {
      const createTip = await this.markdownRepository.create({
        code: 'tip',
        value,
      });
      await this.markdownRepository.save(createTip);

      return createTip;
    } else {
      tip.value = value;
      await this.markdownRepository.save(tip);
      return tip;
    }
  };
}
