import { Injectable } from '@nestjs/common';
import { ArticleDocument } from './article.schema';
import { GetArticleDto } from './_utils/dtos/response/get-article.dto';

@Injectable()
export class ArticlesMapper {
  toGetArticleDto = (article: ArticleDocument): GetArticleDto => ({
    id: article._id.toString(),
    title: article.title,
    content: article.content,
    category: article.category,
  });
}
