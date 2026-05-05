import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class ArticleExceptionsTypes {
  ERROR_LIKE_ARTICLE = new BadRequestException('Failed to like article');
  ERROR_UPDATE_ARTICLE = new BadRequestException('Failed to update article');
  ERROR_CREATE_ARTICLE = new BadRequestException('Failed to create article');
  ERROR_DELETE_ARTICLE = new BadRequestException('Failed to delete article');
  ERROR_NOT_FOUND_ARTICLE = new BadRequestException('Article not found');
  ERROR_INVALID_ARTICLE = new BadRequestException('Article not found');
}
