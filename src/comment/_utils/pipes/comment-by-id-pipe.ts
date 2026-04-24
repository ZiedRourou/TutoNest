import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { CommentDocument } from '../schemas/comment.schema';
import { CommentRepository } from '../../comment.repository';
import { Types } from 'mongoose';
import { CommentExceptionsTypes } from '../errors/comment-exceptions.types';

@Injectable()
export class CommentByIdPipe implements PipeTransform<string, Promise<CommentDocument>> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly commentExceptionsTypes: CommentExceptionsTypes,
  ) {}

  transform(commentId: string) {
    if (!Types.ObjectId.isValid(commentId)) throw this.commentExceptionsTypes.ERROR_NOT_FOUND_COMMENT;
    return this.commentRepository.findOneByIdOrThrow(commentId);
  }
}
