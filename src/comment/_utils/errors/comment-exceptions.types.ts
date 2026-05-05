import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CommentExceptionsTypes {
  ERROR_UPDATE_COMMENT = new BadRequestException('Failed to update comment');
  ERROR_DELETE_COMMENT = new BadRequestException('Failed to delete comment');
  ERROR_NOT_FOUND_COMMENT = new BadRequestException('Comment not found');
  ERROR_FAIL_GET_COMMENT = new BadRequestException('Fail to get comment');
  ERROR_FAIL_CREATE_COMMENT = new BadRequestException('Fail to create comment');
}
