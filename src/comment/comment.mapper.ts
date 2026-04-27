import { Injectable } from '@nestjs/common';
import { CommentDocument } from './_utils/schemas/comment.schema';
import { GetCommentDto } from './_utils/dtos/responses/get-comment.dto';

@Injectable()
export class CommentMapper {
  toGetCommentDto = (comment: CommentDocument): GetCommentDto => ({
    id: comment._id.toString(),
    title: comment.title,
    content: comment.content,
  });
}
