import { Controller, Get, Post, HttpStatus, Body } from '@nestjs/common';
import { Public } from '../auth/guard.metadata';
import { ResponseData, ResponseMessage } from 'src/interfaces/global.type';
import { MarkdownService } from './markdown.service';

@Controller('markdown')
export class MarkdownController {
  constructor(private readonly markdownService: MarkdownService) {}

  @Public()
  @Get('tip')
  async getTip() {
    return new ResponseData(
      await this.markdownService.getTip(),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }
  @Post('tip')
  async postTip(@Body() postTipDto: { value: string }) {
    return new ResponseData(
      await this.markdownService.postTip(postTipDto.value),
      HttpStatus.OK,
      ResponseMessage.SUCCESS,
    );
  }
}
