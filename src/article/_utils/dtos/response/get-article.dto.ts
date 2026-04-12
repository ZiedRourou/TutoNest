import { ApiProperty } from '@nestjs/swagger';
import { ArticleCategory } from '../../article-category.enum';

export class GetArticleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  category: ArticleCategory;

  @ApiProperty()
  imageUrl?: string;
}
