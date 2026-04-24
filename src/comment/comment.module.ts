import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentRepository } from './comment.repository';
import { CommentSchema } from './_utils/schemas/comment.schema';
import { CommentMapper } from './comment.mapper';
import { UsersModule } from '../users/users.module';
import { CommentExceptionsTypes } from './_utils/errors/comment-exceptions.types';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]), UsersModule],
  controllers: [CommentController],
  exports: [CommentService, CommentRepository],
  providers: [CommentService, CommentRepository, CommentMapper, CommentExceptionsTypes],
})
export class CommentModule {}
