import { genericDocWhitAuthor } from 'src/_utils/types/generic.type';
import { AuthorizationError } from 'src/logto/_utils/errors/authorization-error.types';
import { UserDocument } from 'src/users/users.schema';

//c'est quoi le mieux celle ci ou entre les deux options
export function checkAuthor(doc: genericDocWhitAuthor, user: UserDocument) {
  if (!doc.author._id !== user.userLogtoId) throw new AuthorizationError('Not authorized');
}

// interface UserId {
//   _id: Types.ObjectId;
// }

// export function assertIsAuthor(authorId: UserId, user: UserId, documentName: string): void {
//   if (!authorId._id.equals(user._id)) {
//     throw new AuthorizationError('Not allowed to edit this ${documentName}');
//   }
// }
