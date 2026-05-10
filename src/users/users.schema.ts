import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRoleEnum } from './_utils/enum/user-role.enum';
import type { UserRoleEnumValueType } from './_utils/types/user-role.type';
import { RustfsFile, RustfsFileSchema } from '../rustfs/rustfs.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  userLogtoId: string;

  @Prop({ required: true })
  username: string;

  @Prop({
    type: String,
    enum: UserRoleEnum,
  })
  role: UserRoleEnumValueType;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt: Date | null;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ required: false, type: RustfsFileSchema, default: null })
  avatar: RustfsFile | null;

  createdAt: Date;

  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
