import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from './_utils/schemas/article.schema';
import { ArticleRepository } from './article.repository';
import { ArticlesMapper } from './articles.mapper';
import { UsersModule } from '../users/users.module';
import { ArticleExceptionsTypes } from './_utils/errors/article-exceptions.types';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]), UsersModule],
  controllers: [ArticleController],
  exports: [ArticleService, ArticleRepository],
  providers: [ArticleService, ArticleRepository, ArticlesMapper, ArticleExceptionsTypes],
})
export class ArticleModule {}
