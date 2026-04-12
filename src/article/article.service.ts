import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { ArticleRepository } from './article.repository';
import { CreateArticleDto } from './_utils/dtos/request/create-article.dto';
import { UpdateArticleDto } from './_utils/dtos/request/update-article.dto';
import { UserDocument } from '../users/users.schema';
import { ArticlesMapper } from './articles.mapper';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleMapper: ArticlesMapper,
  ) {}

  async createArticle(createArticleDto: CreateArticleDto, user: UserDocument) {
    try {
      const test = await this.articleRepository.createArticle(createArticleDto, user._id);
      // .then(this.articleMapper.toGetArticleDto);
    } catch (error) {
      throw new BadRequestException('Failed to create article:' + error.message);
    }
  }

  async updateArticle(articleId: string, updateArticleDto: UpdateArticleDto, user: UserDocument) {
    const article = await this.articleRepository.getArticleById(articleId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (!(article.author._id.toString() === user._id.toString())) {
      throw new ForbiddenException('not allowed to update this article');
    }

    const updatedArticle = await this.articleRepository.updateArticle(articleId, updateArticleDto);

    if (!updatedArticle) {
      throw new ForbiddenException('not allowed to update this article');
    }

    return this.articleMapper.toGetArticleDto(updatedArticle);
  }

  async deleteArticle(articleId: string, user: UserDocument) {
    const article = await this.articleRepository.getArticleById(articleId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (!(article.author._id.toString() === user._id.toString())) {
      throw new ForbiddenException('not allowed to update this article');
    }

    const articleDeleted = await this.articleRepository.deleteArticle(articleId);

    if (!articleDeleted) {
      throw new NotFoundException('Article not found');
    }

    this.articleMapper.toGetArticleDto(articleDeleted);
  }

  async getAllArticles() {
    try {
      return await this.articleRepository.getAllArticles();
    } catch (error) {
      throw new BadRequestException('Failed to fetch articles' + error);
    }
  }

  async getArticleById(articleId: string) {
    const article = await this.articleRepository.getArticleById(articleId);

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return this.articleMapper.toGetArticleDto(article);
  }
}
