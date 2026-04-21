import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ArticleDocument } from './article.schema';
import { Model, Types } from 'mongoose';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto';
import { MongoId } from '../_utils/types/mongo-id.type';
import { User } from '../users/users.schema';
import { AuthorId } from '../users/_utils/types/author.type';
@Injectable()
export class ArticleRepository {
  constructor(@InjectModel('Article') private articleModel: Model<ArticleDocument>) {}
  private readonly articleNotFoundException = new NotFoundException('Article not found');

  createArticle(createArticleDto: CreateArticleDto, userId: AuthorId) {
    return this.articleModel.create({ ...createArticleDto, author: userId });
  }

  updateOrFailArticle(articleId: MongoId, updateArticleDto: UpdateArticleDto) {
    return this.articleModel
      .findByIdAndUpdate(articleId, updateArticleDto, { new: true })
      .orFail(this.articleNotFoundException)
      .exec();
  }
  deleteOrFailArticle(articleId: MongoId) {
    return this.articleModel.findByIdAndDelete(articleId).orFail(this.articleNotFoundException).exec();
  }

  getAllArticles() {
    return this.articleModel.find().exec();
  }

  findOneByIdOrFail(id: MongoId) {
    return this.articleModel.findById(id).populate(User.name).orFail(this.articleNotFoundException).exec();
  }
}
