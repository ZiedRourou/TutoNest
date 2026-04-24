import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CommentExceptionsTypes {
  ERROR_UPDATE_COMMENT = new BadRequestException('Failed to update comment');
  ERROR_DELETE_COMMENT = new BadRequestException('Failed to delete comment');
  ERROR_NOT_FOUND_COMMENT = new NotFoundException('Comment not found');
  ERROR_FAIL_GET_COMMENT = new NotFoundException('Fail to get comment');
  ERROR_FAIL_CREATE_COMMENT = new NotFoundException('Fail to create comment');
}
