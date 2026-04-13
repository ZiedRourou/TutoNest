import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Protect } from '../auth/_utils/decorator/protect.decorator';
import { ConnectedUser } from '../users/_utils/decorators/connecter-user.decorator';
import { ArticleByIdPipe } from './_utils/pipes/article-by-id-pipe';
import type { UserDocument } from '../users/users.schema';
import type { ArticleDocument } from './article.schema';

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
  getArticleById(@Param('id', ArticleByIdPipe) article: ArticleDocument) {
    return this.articleService.getArticleById(article);
  }

  @Protect()
  @ApiOperation({ summary: 'Create article' })
  @ApiBody({ type: CreateArticleDto })
  @Post()
  postArticle(@ConnectedUser() user: UserDocument, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.createArticle(createArticleDto, user);
  }

  @Protect()
  @ApiOperation({ summary: 'Update article' })
  @ApiBody({ type: UpdateArticleDto })
  @Patch(':id')
  updateArticle(
    @ConnectedUser() user: UserDocument,
    @Param('id', ArticleByIdPipe) article: ArticleDocument,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(article, updateArticleDto, user);
  }

  @Protect()
  @ApiOperation({ summary: 'Delete article' })
  @Delete(':id')
  deleteArticle(@ConnectedUser() user: UserDocument, @Param('id', ArticleByIdPipe) article: ArticleDocument) {
    return this.articleService.deleteArticle(article, user);
  }
}
