import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { ArticleDocument } from '../schemas/article.schema';
import { ArticleRepository } from '../../article.repository';
import { ArticleExceptionsTypes } from '../errors/article-exceptions.types';

@Injectable()
export class ArticleByIdPipe implements PipeTransform<string, Promise<ArticleDocument>> {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleExceptionsTypes: ArticleExceptionsTypes,
  ) {}

  transform(articleId: string) {
    if (!Types.ObjectId.isValid(articleId)) throw this.articleExceptionsTypes.ERROR_INVALID_ARTICLE;
    return this.articleRepository.findOneByIdOrFail(articleId);
  }
}
