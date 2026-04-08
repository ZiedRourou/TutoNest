import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dtos/CreateArticleDto';
import { UpdateArticleDto } from './dtos/UpdateArticleDto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller()
export class ArticleController {
  constructor(private readonly appService: ArticleService) {}

  @ApiOperation({ summary: 'Get all articles' })
  @Get()
  fetchArticles() {
    return this.appService.fetchArticle();
  }

  @ApiOperation({ summary: 'Get article by Id' })
  @Get(':id')
  getArticleById(@Param('id') articleId: string) {
    return this.appService.getArticleById(articleId);
  }

  @ApiOperation({ summary: 'Create article' })
  @ApiBody({ type: CreateArticleDto })
  @Post()
  postArticle(@Body() createArticleDto: CreateArticleDto) {
    return this.appService.createArticle(createArticleDto);
  }

  @ApiOperation({ summary: 'Update article' })
  @ApiBody({ type: UpdateArticleDto })
  @Patch(':id')
  updateArticle(
    @Param('id') articleId: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.appService.updateArticle(articleId, updateArticleDto);
  }

  @ApiOperation({ summary: 'Delete article' })
  @Delete(':id')
  deleteArticle(@Param('id') articleId: string) {
    return this.appService.deleteArticle(articleId);
  }
}
