import { ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthorizationError } from '../../logto/_utils/errors/authorization-error.types';

interface UserId {
  _id: Types.ObjectId;
}

export function assertIsAuthor(authorId: UserId, user: UserId, documentName: string): void {
  if (!authorId._id.equals(user._id)) {
    throw new AuthorizationError('Not allowed to edit this ${documentName}');
  }
}
