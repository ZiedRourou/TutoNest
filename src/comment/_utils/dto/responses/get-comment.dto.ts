import {ApiProperty} from "@nestjs/swagger";

export class GetCommentDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;
}