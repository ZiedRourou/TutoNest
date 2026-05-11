import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { UserExceptionsTypes } from './_utils/errors/user-exceptions.types';
import { LogtoUser } from '../logto/_utils/types/responses/responses.type';
import { UpdateUserDto } from './_utils/dtos/requests/update-user-dto';
import { LogtoId } from '../logto/_utils/types/logto.types';
import { MongoId } from '../_utils/types/mongo-id.type';
import { UpdateUserDataType } from './_utils/types/update-user-data.type';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
    private readonly userException: UserExceptionsTypes,
  ) {}

  async createUser(logtoUser: LogtoUser) {
    const newUser = new this.model({
      userLogtoId: logtoUser.id,
      username: logtoUser.username ?? 'utilisateur',
      email: logtoUser.primaryEmail,
    });
    if (!newUser) throw this.userException.ERROR_CREATE_USER_MONGO_DB;

    return newUser.save();
  }

  async updateByLogtoId(logtoId: LogtoId, updateData: UpdateUserDto) {
    const updatedUser = this.model
      .findOneAndUpdate({ userLogtoId: logtoId }, { $set: updateData }, { new: true })
      .exec();
    if (!updatedUser) throw this.userException.ERROR_CREATE_USER_MONGO_DB;

    return;
  }
  async updateUser(userId: MongoId, updateData: UpdateUserDataType) {
    const updatedUser = this.model.findOneAndUpdate({ userId }, { $set: updateData }, { new: true }).exec();
    if (!updatedUser) throw this.userException.ERROR_CREATE_USER_MONGO_DB;

    return;
  }

  async deleteByLogtoId(logtoId: LogtoId) {
    const result = await this.model.deleteOne({ logtoId }).exec();
    return result.deletedCount > 0;
  }

  findOneByIdOrThrow(userId: LogtoId) {
    return this.model.findOne({ userLogtoId: userId }).orFail(this.userException.ERROR_NOT_FOUND_USER).exec();
  }

  userWithLogtoIdExist(logtoId: LogtoId) {
    return this.model.findOne({ userLogtoId: logtoId });
  }

  async findByLogtoId(logtoId: LogtoId) {
    return this.model.findOne({ userLogtoId: logtoId }).exec();
  }
}
