import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, QueryFilter } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { MongoId } from '../_utils/types/mongo-id.type';
import { UserExceptionsTypes } from './_utils/errors/user-exceptions.types';
import { LogtoUser } from '../logto/_utils/types/responses/responses.type';
import { UpdateAccountDto } from './_utils/dtos/requests/update-user-dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
    private readonly userException: UserExceptionsTypes,
  ) {}

  async createUser(logtoUser: LogtoUser) {
    const newUser = new this.model({
      logtoId: logtoUser.id,
      username: logtoUser.username || logtoUser.name,
      email: logtoUser.primaryEmail,
    });
    return newUser.save();
  }

  async updateByLogtoId(logtoId: MongoId, updateData: UpdateAccountDto) {
    return this.model.findOneAndUpdate({ logtoId }, { $set: updateData }, { new: true }).exec();
  }

  async deleteByLogtoId(logtoId: MongoId) {
    const result = await this.model.deleteOne({ logtoId }).exec();
    return result.deletedCount > 0;
  }

  findOneByIdOrThrow(id: MongoId) {
    return this.model.findOne({ userLogtoId: id.toString() }).orFail(this.userException.ERROR_NOT_FOUND_USER).exec();
  }

  userWithLogtoIdExist(logtoId: MongoId) {
    return this.model.findOne({ userLogtoId: logtoId.toString() });
  }

  async findByLogtoId(logtoId: MongoId) {
    return this.model.findOne({ logtoId }).exec();
  }
}
