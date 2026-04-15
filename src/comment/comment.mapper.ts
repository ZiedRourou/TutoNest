import {Injectable} from "@nestjs/common";
import {CommentDocument} from "./comment.schema";
import {GetCommentDto} from "./_utils/dto/responses/get-comment.dto";

@Injectable()
export class CommentMapper {
    toGetCommentDto = (comment : CommentDocument) : GetCommentDto =>({
        id: comment._id.toString(),
        title: comment.title,
        content: comment.content
    })
}