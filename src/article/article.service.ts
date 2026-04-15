import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';

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
    const newArticle = await this.articleRepository.createArticle(createArticleDto, user._id);

    return this.articleMapper.toGetArticleDto(newArticle);
  }

  async updateArticle(article: ArticleDocument, updateArticleDto: UpdateArticleDto, user: UserDocument) {
    this.isAuthorOfArticle(article, user);
    const updatedArticle = await this.articleRepository.updateOrFailArticle(article._id.toString(), updateArticleDto);

    return this.articleMapper.toGetArticleDto(updatedArticle);
  }

  async deleteArticle(article: ArticleDocument, currentUser: UserDocument) {
    this.isAuthorOfArticle(article, currentUser);
    await this.articleRepository.deleteOrFailArticle(article._id.toString());
  }

  async getAllArticles() {
    const articles = await this.articleRepository.getAllArticles();

    return articles.map(this.articleMapper.toGetArticleDto);
  }

  async getArticleById(article: ArticleDocument) {
    return this.articleMapper.toGetArticleDto(article);
  }

  isAuthorOfArticle(article: ArticleDocument, user: UserDocument): void {
    const authorId = article.author._id;

    if (authorId !== user._id) {
      throw new ForbiddenException('Not allowed to modify this article');
    }
  }
}
