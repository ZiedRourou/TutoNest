import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentRepository } from './comment.repository';
import { CommentSchema } from './comment.schema';
import { CommentMapper } from './comment.mapper';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }])],
  controllers: [CommentController],
  exports: [CommentService, CommentRepository],
  providers: [CommentService, CommentRepository, CommentMapper],
})
export class CommentModule {}
