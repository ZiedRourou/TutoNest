import { RustfsFile } from '../../../rustfs/rustfs.schema';
import { UpdateUserDto } from '../../../users/_utils/dtos/requests/update-user-dto';

export type UpdateArticleDataType = Omit<UpdateUserDto, 'image'> & {
  image: RustfsFile | null;
};
