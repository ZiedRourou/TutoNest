import { GetUserDto } from './_utils/dtos/responses/get-user.dto';
import { UserDocument } from './users.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersMapper {
  toGetUserDto = (user: UserDocument): GetUserDto => ({
    id: user._id.toString(),
    username: user.username,
    role: user.role,
  });
}
