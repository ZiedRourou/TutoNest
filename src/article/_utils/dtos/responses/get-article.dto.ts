import { ApiProperty } from '@nestjs/swagger';
import type { ArticleCategoryEnumValueType } from '../../types/article-category.type';
import type { MongoId } from '../../../../_utils/types/mongo-id.type';
import { RustfsFile } from '../../../../rustfs/rustfs.schema';

export class GetArticleDto {
  @ApiProperty()
  id: MongoId;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  category: ArticleCategoryEnumValueType;

  @ApiProperty()
  image?: RustfsFile | null;
}
