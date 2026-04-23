import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ArticleCategoryEnum } from '../enum/article-category.enum';
import { User, type UserDocument } from '../../../users/users.schema';
import type { ArticleCategoryEnumValueType } from '../types/article-category.type';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true, versionKey: false })
export class Article {
  @Prop({ required: true, type: String, minlength: 5, maxlength: 300 })
  title: string;

  @Prop({ required: true, type: String, minlength: 30, maxlength: 10000 })
  content: string;

  @Prop({ required: true, ref: User.name, type: Types.ObjectId })
  author: Types.ObjectId | UserDocument;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }], default: [] })
  likes: Array<Types.ObjectId | UserDocument>;

  @Prop({
    type: String,
    enum: ArticleCategoryEnum,
    required: true,
    default: ArticleCategoryEnum.BUSINESS,
  })
  category: ArticleCategoryEnumValueType;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
