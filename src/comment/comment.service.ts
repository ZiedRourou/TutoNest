import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './_utils/dtos/requests/create-comment.dto';
import { UserDocument } from '../users/users.schema';
import { UpdateCommentDto } from './_utils/dtos/requests/update-comment.dto';
import { CommentRepository } from './comment.repository';
import { CommentMapper } from './comment.mapper';
import { CommentDocument } from './_utils/schemas/comment.schema';
import { CommentExceptionsTypes } from './_utils/errors/comment-exceptions.types';
import { assertIsAuthor } from 'src/_utils/functions/is-author-function';
import { DocumentEnum } from 'src/_utils/enums/document_category.enum';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly commentMapper: CommentMapper,
    private readonly commentExceptionsTypes: CommentExceptionsTypes,
  ) {}

  async getAllComments() {
    try {
      const comments = await this.commentRepository.getAllComments();
      return comments.map(this.commentMapper.toGetCommentDto);
    } catch (e) {
      throw this.commentExceptionsTypes.ERROR_FAIL_GET_COMMENT;
    }
  }

  async getCommentById(comment: CommentDocument) {
    return this.commentMapper.toGetCommentDto(comment);
  }

  async createComment(createCommentDto: CreateCommentDto, user: UserDocument) {
    try {
      const newComment = await this.commentRepository.createComment(createCommentDto, user._id);
      return this.commentMapper.toGetCommentDto(newComment);
    } catch (e) {
      throw this.commentExceptionsTypes.ERROR_FAIL_CREATE_COMMENT;
    }
  }

  async updateComment(comment: CommentDocument, updateCommentDto: UpdateCommentDto, user: UserDocument) {
    assertIsAuthor(comment._id, user._id, DocumentEnum.COMMENT);
    const updateComment = await this.commentRepository.updateCommentOrFail(comment._id, updateCommentDto);
    return this.commentMapper.toGetCommentDto(updateComment);
  }

  async deleteComment(comment: CommentDocument, user: UserDocument) {
    assertIsAuthor(comment._id, user._id, DocumentEnum.COMMENT);
    await this.commentRepository.deleteCommentOrFail(comment._id);
  }
}
