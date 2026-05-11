import { Injectable } from '@nestjs/common';
import { ArticleDocument } from './_utils/schemas/article.schema';
import { GetArticleDto } from './_utils/dtos/responses/get-article.dto';
import { GetArticleWithStatsDto } from './_utils/dtos/responses/get-article-with-stats.dto';

export type ArticleWithStatsRaw = ArticleDocument & { commentsCount: number };

@Injectable()
export class ArticlesMapper {
  toGetArticleDto = (article: ArticleDocument): GetArticleDto => ({
    id: article._id.toString(),
    title: article.title,
    content: article.content,
    category: article.category,
    image: article.image,
  });

  toGetArticleWithStatsDto = (article: ArticleWithStatsRaw): GetArticleWithStatsDto => {
    const baseArticle = this.toGetArticleDto(article);

    return {
      ...baseArticle,
      commentsCount: article.commentsCount ?? 0,
    };
  };
}
