import { Types } from 'mongoose';

export type MongoId<T> = Types.ObjectId | T;
