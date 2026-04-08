import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true, versionKey: false })
export class Article {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  imageUrl: string;
  @Prop({ required: false, default: Date.now })
  publishDate: Date;
  @Prop({ required: true, ref: 'User' })
  authorId: Types.ObjectId;
}
export const ArticleSchema = SchemaFactory.createForClass(Article);
