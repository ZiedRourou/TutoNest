import { Types } from 'mongoose';
import { UserDocument } from '../../users.schema';

export type AuthorId = Types.ObjectId | UserDocument;
