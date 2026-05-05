import { IsEmail, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export enum LogtoEmailType {
  SignIn = 'SignIn',
  Register = 'Register',
  ForgotPassword = 'ForgotPassword',
  OrganizationInvitation = 'OrganizationInvitation',
  Generic = 'Generic',
  UserPermissionValidation = 'UserPermissionValidation',
  BindNewIdentifier = 'BindNewIdentifier',
  MfaVerification = 'MfaVerification',
  BindMfa = 'BindMfa',
}

export class LogtoEmailPayloadDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  link?: string;
}

export class LogtoEmailWebhookDto {
  @IsEnum(LogtoEmailType)
  @IsNotEmpty()
  type: LogtoEmailType;

  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsObject()
  @IsNotEmpty()
  payload: LogtoEmailPayloadDto;

  @IsString()
  @IsOptional()
  locale?: string;
}
