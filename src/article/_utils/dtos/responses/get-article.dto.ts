import { ApiProperty } from '@nestjs/swagger';
import type { ArticleCategoryType } from '../../enum/article-category.enum';

export class GetArticleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  category: ArticleCategoryType;
}
