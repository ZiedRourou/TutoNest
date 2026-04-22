import { Types } from 'mongoose';
import { ArticleDocument } from 'src/article/article.schema';
import { CommentDocument } from 'src/comment/comment.schema';

export type GenericArticleOrComment = ArticleDocument | CommentDocument;
