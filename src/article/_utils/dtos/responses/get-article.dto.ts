import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ArticleCategoryEnum } from '../../enum/article-category.enum';
import type { ArticleCategoryEnumValueType } from '../../types/article-category.type';

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
