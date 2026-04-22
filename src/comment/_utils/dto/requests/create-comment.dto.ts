import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Great article',
    description: 'comment title',
  })
  @IsString({ message: 'Comment must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @Length(0, 50, {
    message: 'Comment must have 50 characters max',
  })
  title: string;

  @ApiProperty({
    example: 'Great article',
    description: 'description',
  })
  @IsString({ message: 'Comment must be a string' })
  @Length(0, 300, {
    message: 'Comment must have 300 characters max',
  })
  content: string;
}
