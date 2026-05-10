import { UserRoleEnum } from '../users/_utils/enum/user-role.enum';

export const LOGTO_CLIENT_TOKEN = 'LogtoClient';
export const LOGTO_CREDENTIALS = 'LogtoClientCredentials';
export const LOGTO_JWKS_TOKEN = 'LogtoJwks';

export const LOGTO_API_INDICATOR = 'https://default.logto.app/api';
export const LOGTO_TENANT_ID = 'default';
export const LOGTO_URIS_TOKEN = 'default';
export const BEARER_PREFIX = 'Bearer ';
export const ROLES_KEY = 'ROLES_KEY';

export const ALLOWED_ROLES = [UserRoleEnum.AUTHOR, UserRoleEnum.LECTOR] as const;

export const ARTICLE_NAME_ERROR = 'ARTICLE';
export const RUSTFS_CLIENT_TOKEN = 'RustfsClient';
