import { Injectable } from '@nestjs/common';

import { ArticleRepository } from './article.repository';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto';
import { UserDocument } from '../users/users.schema';
import { ArticlesMapper } from './articles.mapper';
import { ArticleDocument } from './_utils/schemas/article.schema';
import { MongoId } from '../_utils/types/mongo-id.type';
import { assertIsAuthor } from '../_utils/functions/is-author-function';
import { DocumentEnum } from 'src/_utils/enums/document_category.enum';
import { RustfsService } from '../rustfs/rustfs.service';
import { RustfsMapper } from '../rustfs/rustfs.mapper';
import { RustfsFile } from '../rustfs/rustfs.schema';

@Injectable()
export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository,
    private readonly articleMapper: ArticlesMapper,
    private readonly rustfsService: RustfsService,
    private readonly rustfsMapper: RustfsMapper,
  ) {}

  async createArticle(createArticleDto: CreateArticleDto, user: UserDocument) {
    let uploadImage: RustfsFile | undefined;

    if (createArticleDto.image) {
      const key = this.rustfsMapper.toUserProfilePictureKey(user.id, createArticleDto.image.extension);
      uploadImage = await this.rustfsService.uploadFile(createArticleDto.image, null, key);
    }

    const image = uploadImage ?? null;
    const newArticle = await this.articleRepository.createArticle({ ...createArticleDto, image: image }, user._id);
    return this.articleMapper.toGetArticleDto(newArticle);
  }

  async updateArticle(article: ArticleDocument, updateArticleDto: UpdateArticleDto, user: UserDocument) {
    let uploadImage: RustfsFile | undefined;

    assertIsAuthor(article._id, user._id, DocumentEnum.ARTICLE);

    if (updateArticleDto.image) {
      const key = this.rustfsMapper.toUserProfilePictureKey(user.id, updateArticleDto.image.extension);
      uploadImage = await this.rustfsService.uploadFile(updateArticleDto.image, null, key);
    }

    const image = uploadImage ?? null;

    const updateArticle = await this.articleRepository.updateOrFailArticle(article.id, {
      ...updateArticleDto,
      image: image,
    });

    return this.articleMapper.toGetArticleDto(updateArticle);
  }
  async toggleLike(article: ArticleDocument, user: UserDocument, like: boolean) {
    const isAlreadyLiked = await this.isUserAlreadyLikeArticle(article._id, user._id);
    if (isAlreadyLiked === like) return;
    await this.articleRepository.toggleLikeArticle(article._id, user._id, like);
    return;
  }

  async deleteArticle(article: ArticleDocument, currentUser: UserDocument) {
    assertIsAuthor(article._id, currentUser._id, DocumentEnum.ARTICLE);
    await this.articleRepository.deleteOrFailArticle(article._id);
    return;
  }

  async getAllArticles() {
    const articles = await this.articleRepository.getAllArticles();

    return articles.map(this.articleMapper.toGetArticleDto);
  }

  async getArticleById(article: ArticleDocument) {
    return this.articleMapper.toGetArticleDto(article);
  }

  async getArticleByIdWithStat(article: ArticleDocument) {
    const statsArray = await this.articleRepository.getArticleWithStats(article._id);

    if (!statsArray) {
      return this.articleMapper.toGetArticleDto(article);
    }
    const articleWithStats = statsArray[0];
    return this.articleMapper.toGetArticleWithStatsDto(articleWithStats);
  }

  private async isUserAlreadyLikeArticle(articleId: MongoId, userId: MongoId) {
    return this.articleRepository.isUserAlreadyLikeArticle(articleId, userId);
  }
}
