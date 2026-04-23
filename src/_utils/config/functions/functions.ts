import { ForbiddenException } from '@nestjs/common';
import { GenericArticleOrComment } from 'src/_utils/types/generic.type';
import { UserDocument } from 'src/users/users.schema';

//c'est quoi le mieux celle ci ou entr eles deux options 
export function checkAuthor(doc: GenericArticleOrComment, user: UserDocument) {
  if (!doc.author._id.equals(user._id)) throw new ForbiddenException('Not authorized');
}

// interface UserId {
//   _id: Types.ObjectId;
// }

// export function assertIsAuthor(authorId: UserId, user: UserId, documentName: string): void {
//   if (!authorId._id.equals(user._id)) {
//     throw new AuthorizationError('Not allowed to edit this ${documentName}');
//   }
// }
