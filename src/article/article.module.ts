import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from './article.schema';
import { ArticleRepository } from './article.repository';
import { ArticlesMapper } from './articles.mapper';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }])],
  controllers: [ArticleController],
  exports: [ArticleService, ArticleRepository],
  providers: [ArticleService, ArticleRepository, ArticlesMapper],
})
export class ArticleModule {}
