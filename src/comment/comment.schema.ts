import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument, Types } from 'mongoose';
import { User, UserDocument } from '../users/users.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true, versionKey: false })
export class Comment {
  @Prop({ required: true, type: String, minlength: 5, maxlength: 300 })
  title: string;

  @Prop({ required: true, type: String, minlength: 30, maxlength: 10000 })
  content: string;

  @Prop({ required: true, ref: User.name, type: Types.ObjectId })
  author: Types.ObjectId | UserDocument;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
