import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './CreateArticleDto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
