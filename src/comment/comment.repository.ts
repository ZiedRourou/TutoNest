import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentDocument } from './_utils/schemas/comment.schema';
import { MongoId } from '../_utils/types/mongo-id.type';
import { CreateCommentDto } from './_utils/dtos/requests/create-comment.dto';
import { UpdateCommentDto } from './_utils/dtos/requests/update-comment.dto';
import { CommentExceptionsTypes } from './_utils/errors/comment-exceptions.types';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel('Comment') private commentModel: Model<CommentDocument>,
    private readonly commentExceptionTypes: CommentExceptionsTypes,
  ) {}

  getAllComments() {
    return this.commentModel.find();
  }

  findOneByIdOrThrow(commentId: MongoId<string>) {
    return this.commentModel.findById(commentId).orFail(this.commentExceptionTypes.ERROR_NOT_FOUND_COMMENT).exec();
  }

  createComment(createCommentDto: CreateCommentDto, userId: Types.ObjectId) {
    return this.commentModel.create({ ...createCommentDto, author: userId._id });
  }

  updateCommentOrFail(commentId: MongoId<Types.ObjectId>, updateCommentDto: UpdateCommentDto) {
    return this.commentModel
      .findByIdAndUpdate(commentId, updateCommentDto, { new: true })
      .orFail(this.commentExceptionTypes.ERROR_UPDATE_COMMENT)
      .exec();
  }

  deleteCommentOrFail(commentId: MongoId<Types.ObjectId>) {
    return this.commentModel
      .findByIdAndDelete(commentId)
      .orFail(this.commentExceptionTypes.ERROR_DELETE_COMMENT)
      .exec();
  }
}
