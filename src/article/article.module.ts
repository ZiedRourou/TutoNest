import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from './_utils/schemas/article.schema';
import { ArticleRepository } from './article.repository';
import { ArticlesMapper } from './articles.mapper';
import { UsersModule } from '../users/users.module';
import { ArticleExceptionsTypes } from './_utils/errors/article-exceptions.types';
import { RustfsModule } from '../rustfs/rustfs.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]), UsersModule, RustfsModule],
  controllers: [ArticleController],
  exports: [ArticleService, ArticleRepository],
  providers: [ArticleService, ArticleRepository, ArticlesMapper, ArticleExceptionsTypes],
})
export class ArticleModule {}
