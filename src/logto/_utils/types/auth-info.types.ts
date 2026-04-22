import { UserDocument } from '../../../users/users.schema';

export class AuthInfo {
  public readonly sub: string;
  public readonly clientId: string | undefined;
  public readonly userLogtoId: string;
  public readonly scopes: string[];
  public readonly role: string;
  public readonly username: string;
  public readonly user: UserDocument;
}
