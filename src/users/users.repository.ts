import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, QueryFilter } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { AuthInfo } from '../logto/_utils/types/auth-info.types';
import { MongoId } from '../_utils/types/mongo-id.type';
import { NewUserRoleDto } from './_utils/dtos/requests/new-user-role.dto';
import { UserExceptionsTypes } from './_utils/errors/user-exceptions.types';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
    private readonly userException: UserExceptionsTypes,
  ) {}

  findOneByIdOrThrow(id: string) {
    return this.model.findOne({ userLogtoId: id }).orFail(this.userException.ERROR_NOT_FOUND_USER).exec();
  }

  userWithLogtoIdExist(userLogtoId: string): Promise<UserDocument | null> {
    return this.model.findOne({ userLogtoId });
  }

  createUser(createUserDto: AuthInfo) {
    return this.model.create({
      username: createUserDto.username,
      userLogtoId: createUserDto.userLogtoId,
      role: createUserDto.role,
    });
  }

  updateUserRole(userId: MongoId<Types.ObjectId>, newRole: NewUserRoleDto) {
    return this.model
      .findByIdAndUpdate(userId, { role: newRole.role })
      .orFail(this.userException.ERROR_UPDATE_USER_ROLE_MONGO_DB)
      .exec();
  }
  deleteUser(userId: MongoId<Types.ObjectId>) {
    return this.model.findByIdAndDelete(userId).orFail(this.userException.ERROR_DELETE_USER_MONGO_DB).exec();
  }
}
