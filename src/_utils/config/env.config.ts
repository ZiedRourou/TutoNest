import { exit } from 'process';
import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested, validateSync } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { Logger, Optional } from '@nestjs/common';

export class LogtoConfig {
  @IsString()
  LOGTO_BASE_URL: string;

  @IsString()
  LOGTO_CLIENT_ID: string;

  @IsString()
  LOGTO_SECRET: string;

  @IsNumber()
  LOGTO_PORT: number;

  @IsNumber()
  LOGTO_ADMIN_PORT: number;

  @IsString()
  LOGTO_TAG: string;

  @IsString()
  LOGTO_ENDPOINT: string;

  @IsString()
  LOGTO_ADMIN_ENDPOINT: string;
}

export class MongoConfig {
  @IsString()
  MONGODB_URL: string;

  @IsNumber()
  MONGO_PORT: number;

  @IsString()
  MONGO_USER: string;

  @IsString()
  MONGO_PASSWORD: string;
}
//
// export class PostgresConfig {
//   @IsString()
//   POSTGRES_USER: string;
//
//   @IsString()
//   POSTGRES_PASSWORD: string;
//
//   @IsString()
//   POSTGRES_DB: string;
// }

export class SMTPConfig {
  @IsString()
  SMTP_HOST: string;

  @IsNumber()
  SMTP_PORT: number;

  @IsString()
  SMTP_USER: string;

  @IsString()
  SMTP_PASSWORD: string;

  @IsString()
  SMTP_SENDER: string;

  @IsString()
  @IsOptional()
  SMTP_SERVICE?: string;

  @IsString()
  @IsOptional()
  SMTP_CONTACT_RECIPIENT?: string;
}
export class EnvironmentVariables {
  @IsNumber()
  NESTJS_PORT: number;

  @ValidateNested()
  @Type(() => MongoConfig)
  MONGO: MongoConfig;

  @ValidateNested()
  @Type(() => LogtoConfig)
  LOGTO: LogtoConfig;

  @ValidateNested()
  @Type(() => SMTPConfig)
  SMTP: SMTPConfig;
}

export function validateEnv(config: Record<string, unknown>) {
  const structuredConfig = {
    NESTJS_PORT: config.NESTJS_PORT,
    MONGO: {
      MONGODB_URL: config.MONGODB_URL,
      MONGO_PORT: config.MONGO_PORT,
      MONGO_USER: config.MONGO_USER,
      MONGO_PASSWORD: config.MONGO_PASSWORD,
    },
    LOGTO: {
      LOGTO_BASE_URL: config.LOGTO_BASE_URL,
      LOGTO_CLIENT_ID: config.LOGTO_CLIENT_ID,
      LOGTO_SECRET: config.LOGTO_SECRET,
      LOGTO_PORT: config.LOGTO_PORT,
      LOGTO_ADMIN_PORT: config.LOGTO_ADMIN_PORT,
      LOGTO_TAG: config.LOGTO_TAG,
      LOGTO_ENDPOINT: config.LOGTO_ENDPOINT,
      LOGTO_ADMIN_ENDPOINT: config.LOGTO_ADMIN_ENDPOINT,
    },

    SMTP: {
      SMTP_HOST: config.SMTP_HOST,
      SMTP_PORT: config.SMTP_PORT,
      SMTP_USER: config.SMTP_USER,
      SMTP_PASSWORD: config.SMTP_PASSWORD,
      SMTP_SENDER: config.SMTP_SENDER,
      SMTP_SERVICE: config.SMTP_SERVICE,
      SMTP_CONTACT_RECIPIENT: config.SMTP_CONTACT_RECIPIENT,
    },
  };

  const validatedConfig = plainToInstance(EnvironmentVariables, structuredConfig, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length) {
    new Logger(validateEnv.name).error(errors.toString());
    exit();
  }

  return validatedConfig;
}
