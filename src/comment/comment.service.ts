import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './_utils/dto/requests/create-comment.dto';
import { UserDocument } from '../users/users.schema';
import { UpdateCommentDto } from './_utils/dto/requests/update-comment.dto';
import { CommentRepository } from './comment.repository';
import { CommentMapper } from './comment.mapper';
import { CommentDocument } from './comment.schema';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly commentMapper: CommentMapper,
  ) {}

  async getAllComments() {
    const comments = await this.commentRepository.getAllComments();
    return comments.map(this.commentMapper.toGetCommentDto);
  }

  async getCommentById(comment: CommentDocument) {
    return this.commentMapper.toGetCommentDto(comment);
  }

  async createComment(createCommentDto: CreateCommentDto, user: UserDocument) {
    const newComment = await this.commentRepository.createComment(createCommentDto, user._id);
    return this.commentMapper.toGetCommentDto(newComment);
  }

  async updateComment(comment: CommentDocument, updateCommentDto: UpdateCommentDto, user: UserDocument) {
    this.checkAuthor(comment, user);
    const updateComment = await this.commentRepository.updateCommentOrFail(comment._id, updateCommentDto);

    return this.commentMapper.toGetCommentDto(updateComment);
  }

  async deleteComment(comment: CommentDocument, user: UserDocument) {
    this.checkAuthor(comment, user);
    await this.commentRepository.deleteCommentOrFail(comment._id);
  }

  private checkAuthor(comment: CommentDocument, user: UserDocument) {
    if (!comment.author._id.equals(user._id)) throw new ForbiddenException('Not authorized');
  }
}
