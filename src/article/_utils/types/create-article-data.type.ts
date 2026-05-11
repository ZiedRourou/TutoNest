import { CreateArticleDto } from '../dtos/requests/create-article.dto';
import { RustfsFile } from '../../../rustfs/rustfs.schema';

export type CreateArticleDataType = Omit<CreateArticleDto, 'image'> & {
  image: RustfsFile | null;
};
