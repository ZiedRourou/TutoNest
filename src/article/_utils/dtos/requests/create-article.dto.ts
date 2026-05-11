import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleCategoryEnum } from '../../enum/article-category.enum';
import type { ArticleCategoryEnumValueType } from '../../types/article-category.type';
import { Optional } from 'class-validator-extended';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { toMB } from '../../../../_utils/file-size.helpers';
import { IMAGES_MIME_TYPES } from '../../../../_utils/mime-type.constants';

export class CreateArticleDto {
  @ApiProperty({
    example: 'Guerre au Moyen-Orient : les Etats-Unis et l’Iran annoncent...',
    description: 'Article title',
  })
  @IsString({ message: 'Article title must be a string' })
  @IsNotEmpty({ message: 'Article title is required' })
  @Length(5, 300, {
    message: 'Article title must be between 5 and 300 characters',
  })
  title: string;

  @ApiProperty({
    example: 'Donald Trump a annoncé une trêve de deux semaines...',
    description: 'Article content',
  })
  @IsString({ message: 'Article content must be a string' })
  @IsNotEmpty({ message: 'Article content is required' })
  @Length(30, 10000, {
    message: 'Article content must be between 30 and 10000 characters',
  })
  content: string;

  @ApiProperty({
    enum: ArticleCategoryEnum,
    example: ArticleCategoryEnum.TECH,
    description: 'Article category',
  })
  @IsEnum(ArticleCategoryEnum, {
    message: 'Article category must be a valid enum value',
  })
  category: ArticleCategoryEnumValueType;

  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
  })
  @Optional()
  @IsFile()
  @MaxFileSize(toMB(8))
  @HasMimeType(IMAGES_MIME_TYPES)
  image?: MemoryStoredFile;
}
