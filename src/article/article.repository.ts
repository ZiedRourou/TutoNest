import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ArticleDocument } from '../schemas/article.schema';
import { Model } from 'mongoose';
import { CreateArticleDto } from './dtos/CreateArticleDto';
import { UpdateArticleDto } from './dtos/UpdateArticleDto';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectModel('Article') private articleModel: Model<ArticleDocument>,
  ) {}

  createArticle(createArticleDto: CreateArticleDto) {
    return this.articleModel.create(createArticleDto);
  }
  updateArticle(articleId: string, updateArticleDto: UpdateArticleDto) {
    return this.articleModel
      .findByIdAndUpdate(articleId, updateArticleDto)
      .exec();
  }
  deleteArticle(articleId: string) {
    return this.articleModel.findByIdAndDelete(articleId).exec();
  }
  getArticles() {
    return this.articleModel.find().exec();
  }
  getArticleById(articleId: string) {
    return this.articleModel.findById(articleId);
  }
}
