import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, QueryFilter } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from './_utils/dtos/requests/create-user.dto';
import { EncryptionService } from 'src/encryption/encryption.service';

@Injectable()
export class UsersRepository {
  private readonly orFailNotFound = new NotFoundException('User not found');

  constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
    private readonly encryptionService: EncryptionService,
  ) {}

  findOneByIdOrThrow(id: string) {
    return this.model.findById(id).orFail(this.orFailNotFound).exec();
  }

  findOneByEmailOrThrow(email: string) {
    return this.model.findOne({ email: email, deletedAt: null }).orFail(this.orFailNotFound).exec();
  }

  async updatePasswordById(id: Types.ObjectId, password: string) {
    const hashedPassword = await this.encryptionService.encrypt(password);
    return this.model
      .findByIdAndUpdate(id, {
        password: hashedPassword,
      })
      .exec();
  }

  userWithEmailExists(email: string) {
    return this.model.exists({ email: email, deletedAt: null }).exec();
  }

  async createUser(createUserDto: CreateUserDto) {
    const hashPassword = await this.encryptionService.encrypt(createUserDto.password);
    return this.model.create({
      email: createUserDto.email,
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      password: hashPassword,
      role: createUserDto.role,
    });
  }
}
