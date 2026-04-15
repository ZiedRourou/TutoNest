import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRoleEnum } from './_utils/enum/user-role.enum';
import type { UserRoleEnumValueType } from './_utils/types/user-role.type';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true, lowercase: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnumValueType;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
