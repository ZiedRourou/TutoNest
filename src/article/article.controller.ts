import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './_utils/dtos/request/create-article.dto';
import { UpdateArticleDto } from './_utils/dtos/request/update-article.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Protect } from '../auth/_utils/decorator/protect.decorator';
import { ConnectedUser } from '../users/_utils/decorator/connecter-user.decorator';
import * as usersSchema from '../users/users.schema';
import { ArticleByIdPipe } from './_utils/article-by-id-pipe';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: 'Get all articles' })
  @Get()
  getAllArticles() {
    return this.articleService.getAllArticles();
  }

  @ApiOperation({ summary: 'Get article by Id' })
  @Get(':id')
  getArticleById(@Param('id', ArticleByIdPipe) articleId: string) {
    return this.articleService.getArticleById(articleId);
  }

  @Protect()
  @ApiOperation({ summary: 'Create article' })
  @ApiBody({ type: CreateArticleDto })
  @Post()
  postArticle(@ConnectedUser() user: usersSchema.UserDocument, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.createArticle(createArticleDto, user);
  }

  @Protect()
  @ApiOperation({ summary: 'Update article' })
  @ApiBody({ type: UpdateArticleDto })
  @Patch(':id')
  updateArticle(
    @ConnectedUser() user: usersSchema.UserDocument,
    @Param('id') articleId: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(articleId, updateArticleDto, user);
  }

  @Protect()
  @ApiOperation({ summary: 'Delete article' })
  @Delete(':id')
  deleteArticle(@ConnectedUser() user: usersSchema.UserDocument, @Param('id', ArticleByIdPipe) articleId: string) {
    return this.articleService.deleteArticle(articleId, user);
  }
}
