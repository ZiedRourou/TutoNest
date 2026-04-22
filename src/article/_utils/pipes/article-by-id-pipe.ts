import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { ArticleDocument } from '../../article.schema';
import { ArticleRepository } from '../../article.repository';

@Injectable()
export class ArticleByIdPipe implements PipeTransform<string, Promise<ArticleDocument>> {
  constructor(private readonly articleRepository: ArticleRepository) {}

  transform(articleId: string) {
    if (!Types.ObjectId.isValid(articleId)) throw new BadRequestException('INVALID_USER_ID');
    return this.articleRepository.findOneByIdOrFail(articleId);
  }
}
