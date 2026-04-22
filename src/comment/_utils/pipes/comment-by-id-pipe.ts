import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { CommentDocument } from '../../comment.schema';
import { CommentRepository } from '../../comment.repository';
import { Types } from 'mongoose';

@Injectable()
export class CommentByIdPipe implements PipeTransform<string, Promise<CommentDocument>> {
  constructor(private readonly commentRepository: CommentRepository) {}

  transform(commentId: string) {
    if (!Types.ObjectId.isValid(commentId)) throw new NotFoundException(``);
    return this.commentRepository.findOneByIdOrThrow(commentId);
  }
}
