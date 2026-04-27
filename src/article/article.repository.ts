import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ArticleDocument } from './_utils/schemas/article.schema';
import { Model, Types } from 'mongoose';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto';
import { MongoId } from '../_utils/types/mongo-id.type';
import { User, UserDocument } from '../users/users.schema';
import { ArticleExceptionsTypes } from './_utils/errors/article-exceptions.types';
@Injectable()
export class ArticleRepository {
  constructor(
    @InjectModel('Article') private articleModel: Model<ArticleDocument>,
    private readonly articleException: ArticleExceptionsTypes,
  ) {}

  createArticle(createArticleDto: CreateArticleDto, userId: MongoId<UserDocument>) {
    return this.articleModel.create({ ...createArticleDto, author: userId });
  }

  updateOrFailArticle(articleId: MongoId<Types.ObjectId>, updateArticleDto: UpdateArticleDto) {
    return this.articleModel
      .findByIdAndUpdate(articleId, updateArticleDto, { new: true })
      .orFail(this.articleException.ERROR_UPDATE_ARTICLE)
      .exec();
  }
  deleteOrFailArticle(articleId: MongoId<Types.ObjectId>) {
    return this.articleModel.findByIdAndDelete(articleId).orFail(this.articleException.ERROR_DELETE_ARTICLE).exec();
  }

  isArticleLikedByUser(articleId: MongoId<Types.ObjectId>, userId: MongoId<Types.ObjectId>) {
    return this.articleModel.exists({ _id: articleId, likes: userId });
  }

  likeArticleByUser(articleId: MongoId<Types.ObjectId>, userId: MongoId<Types.ObjectId>) {
    return this.articleModel
      .findByIdAndUpdate(articleId, { $addToSet: { likes: userId } })
      .orFail(this.articleException.ERROR_LIKE_ARTICLE)
      .exec();
  }

  dislikeArticleByUser(articleId: MongoId<Types.ObjectId>, userId: MongoId<Types.ObjectId>) {
    return this.articleModel
      .findByIdAndUpdate(articleId, { $pull: { likes: userId } })
      .orFail(this.articleException.ERROR_LIKE_ARTICLE)
      .exec();
  }

  getAllArticles() {
    return this.articleModel.find();
  }

  findOneByIdOrFail(id: MongoId<string>) {
    return this.articleModel
      .findById(id)
      .populate(User.name)
      .orFail(this.articleException.ERROR_NOT_FOUND_ARTICLE)
      .exec();
  }
}
