import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Protect } from '../logto/_utils/decorators/protect.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './_utils/dtos/requests/create-comment.dto';
import { UpdateCommentDto } from './_utils/dtos/requests/update-comment.dto';
import { ConnectedUser } from '../users/_utils/decorators/connecter-user.decorator';
import { CommentByIdPipe } from './_utils/pipes/comment-by-id-pipe';
import type { UserDocument } from '../users/users.schema';
import type { CommentDocument } from './_utils/schemas/comment.schema';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Comments' })
  getAllComments() {
    return this.commentService.getAllComments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Comment by Id' })
  getCommentById(@Param('id', CommentByIdPipe) comment: CommentDocument) {
    return this.commentService.getCommentById(comment);
  }

  @Post()
  @Protect()
  @ApiOperation({ summary: 'Create Comment' })
  @ApiBody({ type: CreateCommentDto })
  postComment(@Body() createCommentDto: CreateCommentDto, @ConnectedUser() user: UserDocument) {
    return this.commentService.createComment(createCommentDto, user);
  }

  @Patch(':id')
  @Protect()
  @ApiOperation({ summary: 'Update Comment' })
  @ApiBody({ type: UpdateCommentDto })
  updateComment(
    @Param('id', CommentByIdPipe) comment: CommentDocument,
    @Body() updateCommentDto: UpdateCommentDto,
    @ConnectedUser() user: UserDocument,
  ) {
    return this.commentService.updateComment(comment, updateCommentDto, user);
  }

  @Delete(':id')
  @Protect()
  @ApiOperation({ summary: 'Delete Comment' })
  deleteComment(@Param('id', CommentByIdPipe) comment: CommentDocument, @ConnectedUser() user: UserDocument) {
    return this.commentService.deleteComment(comment, user);
  }
}
