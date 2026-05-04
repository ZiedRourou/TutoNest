import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRoleEnum } from './_utils/enum/user-role.enum';
import type { UserRoleEnumValueType } from './_utils/types/user-role.type';

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

  createdAt: Date;

  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
