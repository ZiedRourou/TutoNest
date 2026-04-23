import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';

import { ArticleRepository } from './article.repository';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto';
import { UserDocument } from '../users/users.schema';
import { ArticlesMapper } from './articles.mapper';
import { ArticleDocument } from './_utils/schemas/article.schema';
import { MongoId } from '../_utils/types/mongo-id.type';
import { assertIsAuthor } from '../_utils/functions/is-author-function';
import { ARTICLE_NAME_ERROR } from '../_utils/constants';
import { Types } from 'mongoose';

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
    assertIsAuthor(article._id, user._id, ARTICLE_NAME_ERROR);
    const updatedArticle = await this.articleRepository.updateOrFailArticle(article._id, updateArticleDto);

    return this.articleMapper.toGetArticleDto(updatedArticle);
  }
  async likeArticle(article: ArticleDocument, user: UserDocument) {
    const isAlreadyLiked = await this.isUserAlreadyLikeArticle(article._id, user._id);
    if (isAlreadyLiked) return;
    await this.articleRepository.likeArticleByUser(article._id, user._id);

    return;
  }

  async dislikeArticle(article: ArticleDocument, user: UserDocument) {
    const isAlreadyLiked = await this.isUserAlreadyLikeArticle(article._id, user._id);
    if (!isAlreadyLiked) return;
    await this.articleRepository.dislikeArticleByUser(article._id, user._id);

    return;
  }
  async deleteArticle(article: ArticleDocument, currentUser: UserDocument) {
    assertIsAuthor(article._id, currentUser._id, ARTICLE_NAME_ERROR);
    await this.articleRepository.deleteOrFailArticle(article._id);
  }

  async getAllArticles() {
    const articles = await this.articleRepository.getAllArticles();

    return articles.map(this.articleMapper.toGetArticleDto);
  }

  async getArticleById(article: ArticleDocument) {
    return this.articleMapper.toGetArticleDto(article);
  }

  async getArticleByIdWithStat(article: ArticleDocument) {
    return;
  }

  private async isUserAlreadyLikeArticle(articleId: MongoId<Types.ObjectId>, userId: MongoId<Types.ObjectId>) {
    return this.articleRepository.isArticleLikedByUser(articleId, userId);
  }
}
