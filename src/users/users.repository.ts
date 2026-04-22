import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, QueryFilter } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { EncryptionService } from 'src/encryption/encryption.service';
import { AuthInfo } from '../logto/_utils/types/auth-info.types';

@Injectable()
export class UsersRepository {
  private readonly orFailNotFound = new NotFoundException('User not found');

  constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
    private readonly encryptionService: EncryptionService,
  ) {}

  findOneByIdOrThrow(id: string) {
    return this.model.findOne({ userLogtoId: id }).orFail(this.orFailNotFound).exec();
  }

  async updatePasswordById(id: Types.ObjectId, password: string) {
    const hashedPassword = await this.encryptionService.encrypt(password);
    return this.model.findByIdAndUpdate(id, {
      password: hashedPassword,
    });
  }

  async userWithLogtoIdExist(userLogtoId: string): Promise<UserDocument | null> {
    return this.model.findOne({ userLogtoId });
  }

  async createUser(createUserDto: AuthInfo) {
    return this.model.create({
      username: createUserDto.username,
      userLogtoId: createUserDto.userLogtoId,
      role: createUserDto.role,
    });
  }
}
