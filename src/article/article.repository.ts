import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ArticleDocument } from './article.schema';
import { Model, Types } from 'mongoose';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto';
export type MongoId = Types.ObjectId | string;
@Injectable()
export class ArticleRepository {
  constructor(@InjectModel('Article') private articleModel: Model<ArticleDocument>) {}
  private readonly orFailNotFound = new NotFoundException('Article not found');

  createArticle(createArticleDto: CreateArticleDto, userId: Types.ObjectId) {
    return this.articleModel.create({ ...createArticleDto, author: userId._id });
  }

  updateArticle(articleId: MongoId, updateArticleDto: UpdateArticleDto) {
    return this.articleModel.findByIdAndUpdate(articleId, updateArticleDto, { new: true }).exec();
  }

  deleteArticle(articleId: string) {
    return this.articleModel.findByIdAndDelete(articleId).exec();
  }

  getAllArticles() {
    return this.articleModel.find().exec();
  }

  findOneByIdOrThrow(id: string) {
    return this.articleModel.findById(id).orFail(this.orFailNotFound).exec();
  }
}
