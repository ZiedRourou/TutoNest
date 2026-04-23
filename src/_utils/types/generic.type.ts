import { ArticleDocument } from 'src/article/_utils/schemas/article.schema';
import { CommentDocument } from 'src/comment/comment.schema';

export type GenericArticleOrComment = ArticleDocument | CommentDocument;

export type genericDocWhitAuthor<T> = T & HasAuthorIdDocument;

interface HasAuthorIdDocument extends Document {
  author: {
    _id: string;
  };
}
