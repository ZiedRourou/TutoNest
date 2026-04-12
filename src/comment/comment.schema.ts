import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true, versionKey: false })
export class Comment {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Article' })
  articleId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  authorId: Types.ObjectId;

  @Prop({ required: true, type: String })
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
