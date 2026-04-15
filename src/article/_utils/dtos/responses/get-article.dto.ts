import { ApiProperty } from '@nestjs/swagger';
import { ArticleCategoryEnum, type ArticleCategoryEnumValueType } from '../../enum/article-category.enum';
import { IsEnum, IsString } from 'class-validator';

export class GetArticleDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsEnum(ArticleCategoryEnum)
  category: ArticleCategoryEnumValueType;
}
