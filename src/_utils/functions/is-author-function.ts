import { Types } from 'mongoose';
import { DocumentEnum } from '../enums/document_category.enum';
import { AuthorizationError } from '../../logto/_utils/errors/authorization-error.types';

export function assertIsAuthor(authorId: Types.ObjectId, userId: Types.ObjectId, documentName: String): void {
  if (!authorId._id.equals(userId._id)) {
    throw new AuthorizationError(`Not allowed to edit this ${documentName}`);
  }
}
