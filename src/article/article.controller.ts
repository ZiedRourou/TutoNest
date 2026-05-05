import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Protect } from '../logto/_utils/decorators/protect.decorator';
import { ConnectedUser } from '../users/_utils/decorators/connecter-user.decorator';
import { ArticleByIdPipe } from './_utils/pipes/article-by-id-pipe';
import type { UserDocument } from '../users/users.schema';
import type { ArticleDocument } from './_utils/schemas/article.schema';
import { UserRoleEnum } from '../users/_utils/enum/user-role.enum';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @Protect()
  @ApiOperation({ summary: 'Get all articles' })
  getAllArticles() {
    return this.articleService.getAllArticles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by Id' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ObjectId Of article',
  })
  getArticleById(@Param('id', ArticleByIdPipe) article: ArticleDocument) {
    return this.articleService.getArticleById(article);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get article by Id' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ObjectId Of article',
  })
  getArticleByIdWithStat(@Param('id', ArticleByIdPipe) article: ArticleDocument) {
    //pas finis je regarde encore l'aggregation
    return this.articleService.getArticleByIdWithStat(article);
  }

  @Post()
  @Protect({ roles: [UserRoleEnum.AUTHOR, UserRoleEnum.ADMIN] })
  @ApiOperation({ summary: 'Create article' })
  @ApiBody({ type: CreateArticleDto })
  postArticle(@ConnectedUser() user: UserDocument, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.createArticle(createArticleDto, user);
  }

  @Patch(':id/like')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Protect()
  @ApiOperation({ summary: 'Like article' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ObjectId Of article',
  })
  likeArticle(@ConnectedUser() user: UserDocument, @Param('id', ArticleByIdPipe) article: ArticleDocument) {
    return this.articleService.toggleLike(article, user, true);
  }

  @Patch(':id/dislike')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Protect()
  @ApiOperation({ summary: 'Dislike article' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ObjectId Of article',
  })
  dislikeArticle(@ConnectedUser() user: UserDocument, @Param('id', ArticleByIdPipe) article: ArticleDocument) {
    return this.articleService.toggleLike(article, user, false);
  }

  @Patch(':id')
  @Protect({ roles: [UserRoleEnum.AUTHOR, UserRoleEnum.ADMIN] })
  @ApiOperation({ summary: 'Update article' })
  @ApiBody({ type: UpdateArticleDto })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ObjectId Of article',
  })
  updateArticle(
    @ConnectedUser() user: UserDocument,
    @Param('id', ArticleByIdPipe) article: ArticleDocument,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(article, updateArticleDto, user);
  }

  @Delete(':id')
  @Protect({ roles: [UserRoleEnum.AUTHOR, UserRoleEnum.ADMIN] })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete article' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ObjectId Of article',
  })
  deleteArticle(@ConnectedUser() user: UserDocument, @Param('id', ArticleByIdPipe) article: ArticleDocument) {
    return this.articleService.deleteArticle(article, user);
  }
}
