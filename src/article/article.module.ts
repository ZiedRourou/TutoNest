import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticleSchema } from '../schemas/article.schema';
import { ArticleRepository } from './article.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Article', schema: ArticleSchema }]),
  ],
  controllers: [ArticleController],
  exports: [ArticleService, ArticleRepository],
  providers: [ArticleService, ArticleRepository],
})
export class ArticleModule {}
