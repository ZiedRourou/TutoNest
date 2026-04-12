import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ArticleCategory } from './_utils/article-category.enum';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true, versionKey: false })
export class Article {
  @Prop({ required: true, type: String, minlength: 5, maxlength: 300 })
  title: string;

  @Prop({ required: true, type: String, minlength: 30, maxlength: 10000 })
  content: string;

  //rustfs
  // @Prop({ required: true, type: String })
  // imageUrl: string;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  author: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes: Types.ObjectId[];

  @Prop({
    type: String,
    enum: ArticleCategory,
    required: true,
  })
  category: ArticleCategory;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
