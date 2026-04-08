import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly title: string;

  @IsNumber()
  @IsNotEmpty()
  @MaxLength(3000)
  readonly content: string;

  @IsNumber()
  @IsNotEmpty()
  @MaxLength(300)
  readonly imageUrl: string;

  @IsDate()
  @IsNotEmpty()
  readonly publishDate: Date;
}
