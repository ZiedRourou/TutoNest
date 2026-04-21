import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './_utils/dtos/requests/create-article.dto';
import { UpdateArticleDto } from './_utils/dtos/requests/update-article.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Protect } from '../logto/_utils/decorators/protect.decorator';
import { ConnectedUser } from '../users/_utils/decorators/connecter-user.decorator';
import { ArticleByIdPipe } from './_utils/pipes/article-by-id-pipe';
import type { UserDocument } from '../users/users.schema';
import type { ArticleDocument } from './article.schema';
import { AccessTokenGuard } from '../logto/_utils/guards/access-token.guard';
import { UserRoleEnum } from '../users/_utils/enum/user-role.enum';
import { UserPermissionEnum } from '../users/_utils/enum/user-permission.type';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Protect({ roles: [UserRoleEnum.ADMIN] })
  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  getAllArticles() {
    return this.articleService.getAllArticles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by Id' })
  getArticleById(@Param('id', ArticleByIdPipe) article: ArticleDocument) {
    return this.articleService.getArticleById(article);
  }

  @Protect()
  @Post()
  @ApiOperation({ summary: 'Create article' })
  @ApiBody({ type: CreateArticleDto })
  postArticle(@ConnectedUser() user: UserDocument, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.createArticle(createArticleDto, user);
  }

  @Protect()
  @Patch(':id')
  @ApiOperation({ summary: 'Update article' })
  @ApiBody({ type: UpdateArticleDto })
  updateArticle(
    @ConnectedUser() user: UserDocument,
    @Param('id', ArticleByIdPipe) article: ArticleDocument,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.updateArticle(article, updateArticleDto, user);
  }

  @Delete(':id')
  @Protect()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete article' })
  deleteArticle(@ConnectedUser() user: UserDocument, @Param('id', ArticleByIdPipe) article: ArticleDocument) {
    return this.articleService.deleteArticle(article, user);
  }
}
