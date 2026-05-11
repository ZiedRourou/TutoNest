import { UpdateUserDto } from '../dtos/requests/update-user-dto';
import { RustfsFile } from '../../../rustfs/rustfs.schema';

export type UpdateUserDataType = Omit<UpdateUserDto, 'avatar'> & {
  avatar: RustfsFile | null;
};
