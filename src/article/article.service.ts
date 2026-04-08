import { Injectable } from '@nestjs/common';

import { ArticleRepository } from './article.repository';
import { CreateArticleDto } from './dtos/CreateArticleDto';
import { UpdateArticleDto } from './dtos/UpdateArticleDto';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async createArticle(createArticleDto: CreateArticleDto) {
    return await this.articleRepository.createArticle(createArticleDto);
  }
  async updateArticle(articleId: string, updateArticleDto: UpdateArticleDto) {
    return await this.articleRepository.updateArticle(
      articleId,
      updateArticleDto,
    );
  }
  async deleteArticle(articleId: string) {
    return await this.articleRepository.deleteArticle(articleId);
  }
  async fetchArticle() {
    return await this.articleRepository.getArticles();
  }
  async getArticleById(articleId: string) {
    return this.articleRepository.getArticleById(articleId);
  }
}
