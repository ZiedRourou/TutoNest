import { ForbiddenException } from '@nestjs/common';
import { GenericArticleOrComment } from 'src/_utils/types/generic.type';
import { UserDocument } from 'src/users/users.schema';

export function checkAuthor(doc: GenericArticleOrComment, user: UserDocument) {
  if (!doc.author._id.equals(user._id)) throw new ForbiddenException('Not authorized');
}
