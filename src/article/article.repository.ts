import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ArticleDocument } from './_utils/schemas/article.schema';
import { Model, Types } from 'mongoose';
import { MongoId } from '../_utils/types/mongo-id.type';
import { User } from '../users/users.schema';
import { ArticleExceptionsTypes } from './_utils/errors/article-exceptions.types';
import { CreateArticleDataType } from './_utils/types/create-article-data.type';
import { UpdateArticleDataType } from './_utils/types/update-article-data.type';
@Injectable()
export class ArticleRepository {
  constructor(
    @InjectModel('Article') private articleModel: Model<ArticleDocument>,
    private readonly articleException: ArticleExceptionsTypes,
  ) {}

  createArticle(createArticleData: CreateArticleDataType, userId: MongoId) {
    return this.articleModel.create({ ...createArticleData, author: new Types.ObjectId(userId) });
  }

  updateOrFailArticle(articleId: MongoId, updateArticleDto: UpdateArticleDataType) {
    return this.articleModel
      .findByIdAndUpdate(articleId, updateArticleDto, { new: true })
      .orFail(this.articleException.ERROR_UPDATE_ARTICLE)
      .exec();
  }
  deleteOrFailArticle(articleId: MongoId) {
    return this.articleModel.findByIdAndDelete(articleId).orFail(this.articleException.ERROR_DELETE_ARTICLE).exec();
  }

  async getArticleWithStats(articleId: MongoId) {
    const result = this.articleModel
      .aggregate()
      .match({ _id: new Types.ObjectId(articleId) })
      .lookup({ from: 'comments', localField: '_id', foreignField: 'article', as: 'commentsData' })
      .addFields({ commentsCount: { $size: '$commentsData' } })
      .project({ commentsData: 0 })
      .exec();

    return result[0] ?? null;
  }

  async isUserAlreadyLikeArticle(articleId: MongoId, userId: MongoId): Promise<boolean> {
    const result = await this.articleModel.exists({ _id: articleId, likes: userId });
    return !!result;
  }

  toggleLikeArticle(articleId: MongoId, userId: MongoId, like: boolean) {
    const update = like ? { $addToSet: { likes: userId } } : { $pull: { likes: userId } };

    return this.articleModel
      .findByIdAndUpdate(articleId, update)
      .orFail(this.articleException.ERROR_LIKE_ARTICLE)
      .exec();
  }

  getAllArticles() {
    return this.articleModel.find();
  }

  findOneByIdOrFail(id: MongoId) {
    return this.articleModel
      .findById(id)
      .populate(User.name)
      .orFail(this.articleException.ERROR_NOT_FOUND_ARTICLE)
      .exec();
  }
}
