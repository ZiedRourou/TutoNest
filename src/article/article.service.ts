import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { ArticleRepository } from './article.repository';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto';
import { UserDocument } from '../users/users.schema';
import { ArticlesMapper } from './articles.mapper';
import { ArticleDocument } from './article.schema';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleMapper: ArticlesMapper,
  ) {}

  async createArticle(createArticleDto: CreateArticleDto, user: UserDocument) {
    try {
      const newArticle = await this.articleRepository.createArticle(createArticleDto, user._id);
      return this.articleMapper.toGetArticleDto(newArticle);
    } catch (error) {
      throw new BadRequestException('Failed to create article:' + error.message);
    }
  }

  async updateArticle(article: ArticleDocument, updateArticleDto: UpdateArticleDto, user: UserDocument) {
    if (!(article.author._id.toString() === user._id.toString())) {
      throw new ForbiddenException('not allowed to update this article');
    }

    const updatedArticle = await this.articleRepository.updateArticle(article._id.toString(), updateArticleDto);

    if (!updatedArticle) {
      throw new ForbiddenException('not allowed to update this article');
    }

    return this.articleMapper.toGetArticleDto(updatedArticle);
  }

  async deleteArticle(article: ArticleDocument, user: UserDocument) {
    if (!(article.author._id.toString() === user._id.toString())) {
      throw new ForbiddenException('not allowed to update this article');
    }

    const articleDeleted = await this.articleRepository.deleteArticle(article._id.toString());

    if (!articleDeleted) {
      throw new NotFoundException('Article not found');
    }

    this.articleMapper.toGetArticleDto(articleDeleted);
  }

  async getAllArticles() {
    try {
      const articles = await this.articleRepository.getAllArticles();
      return articles.map(this.articleMapper.toGetArticleDto);
    } catch (error) {
      throw new BadRequestException('Failed to fetch articles' + error);
    }
  }

  async getArticleById(article: ArticleDocument) {
    return this.articleMapper.toGetArticleDto(article);
  }
}
