import { Module } from '@nestjs/common';

import { ArticleModule } from './article/article.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017'), ArticleModule],
})
export class AppModule {}
