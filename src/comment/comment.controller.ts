import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Protect } from '../auth/_utils/decorator/protect.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './_utils/dto/requests/create-comment.dto';
import { UpdateCommentDto } from './_utils/dto/requests/update-comment.dto';
import { ConnectedUser } from '../users/_utils/decorators/connecter-user.decorator';
import { CommentByIdPipe } from './_utils/pipes/comment-by-id-pipe';
import type { UserDocument } from '../users/users.schema';
import type { CommentDocument } from './comment.schema';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Get all Comments' })
  @Get()
  getAllComments() {
    return this.commentService.getAllComments();
  }

  @ApiOperation({ summary: 'Get Comment by Id' })
  @Get(':id')
  getCommentById(@Param('id', CommentByIdPipe) comment: CommentDocument) {
    return this.commentService.getCommentById(comment);
  }

  @Protect()
  @ApiOperation({ summary: 'Create Comment' })
  @ApiBody({ type: CreateCommentDto })
  @Post()
  postComment(@Body() createCommentDto: CreateCommentDto, @ConnectedUser() user: UserDocument) {
    return this.commentService.createComment(createCommentDto, user);
  }

  @Protect()
  @ApiOperation({ summary: 'Update Comment' })
  @ApiBody({ type: UpdateCommentDto })
  @Patch(':id')
  updateComment(
    @Param('id', CommentByIdPipe) comment: CommentDocument,
    @Body() updateCommentDto: UpdateCommentDto,
    @ConnectedUser() user: UserDocument,
  ) {
    return this.commentService.updateComment(comment, updateCommentDto, user);
  }

  @Protect()
  @ApiOperation({ summary: 'Delete Comment' })
  @Delete(':id')
  deleteComment(@Param('id', CommentByIdPipe) comment: CommentDocument, @ConnectedUser() user: UserDocument) {
    return this.commentService.deleteComment(comment, user);
  }
}
