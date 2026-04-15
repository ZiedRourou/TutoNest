import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from "mongoose";
import {CommentDocument} from "./comment.schema";
import {MongoId} from '../_utils/types/mongo-id.type';
import {CreateCommentDto} from "./_utils/dto/requests/create-comment.dto";
import {UpdateCommentDto} from "./_utils/dto/requests/update-comment.dto";

@Injectable()
export class CommentRepository {
    constructor(@InjectModel('Comment') private commentModel: Model<CommentDocument>) {
    }

    private readonly orFailNotFound = new NotFoundException('Comment not found');

    getAllComments() {
        return this.commentModel.find().exec();
    }

    findOneByIdOrThrow(commentId: MongoId) {
        return this.commentModel
            .findById(commentId)
            .orFail(this.orFailNotFound)
            .exec();
    }

    createComment(
        createCommentDto: CreateCommentDto,
        userId: Types.ObjectId
    ) {
        return this.commentModel.create({...createCommentDto, author: userId._id})
    }

    updateCommentOrFail(
        commentId: MongoId,
        updateCommentDto: UpdateCommentDto
    ) {
        return this.commentModel
            .findByIdAndUpdate(commentId, updateCommentDto, {new: true})
            .orFail(this.orFailNotFound)
            .exec();
    }

    deleteCommentOrFail(commentId: MongoId) {
        return this.commentModel.findByIdAndDelete(commentId)
            .orFail(this.orFailNotFound)
            .exec();
    }
}