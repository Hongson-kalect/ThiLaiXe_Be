import { Module } from '@nestjs/common';
import { MarkdownController } from './markdown.controller';
import { MarkdownService } from './markdown.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Markdown } from 'src/typeOrm/entities/Markdown';

@Module({
  imports: [TypeOrmModule.forFeature([Markdown])],
  controllers: [MarkdownController],
  providers: [MarkdownService],
})
export class MarkdownModule {}
