import { exit } from 'process';
import { IsEmail, IsEnum, IsNumber, IsString, ValidateNested, validateSync } from 'class-validator';
import { plainToInstance, Type } from 'class-transformer';
import { Logger } from '@nestjs/common';
import { EnvironmentEnum } from '../enums/environnement-enum';
import type { EnvironnementEnumValueType } from '../types/environnement-type';

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

  @IsString()
  LOGTO_WEBHOOK_SIGNING_KEY: string;
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

  @IsString()
  MONGO_TAG: string;
}

export class PostgresConfig {
  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DB: string;

  @IsString()
  POSTGRES_TAG: string;
}

export class SmtpConfig {
  @IsString()
  SMTP_HOST: string;

  @IsNumber()
  SMTP_PORT: number;

  @IsEmail()
  SMTP_SENDER_EMAIL: string;

  @IsString()
  SMTP_SENDER_NAME: string;

  @IsString()
  MAILHOG_TAG: string;
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
  @Type(() => PostgresConfig)
  POSTGRES: PostgresConfig;

  @ValidateNested()
  @Type(() => SmtpConfig)
  SMTP: SmtpConfig;

  @IsEnum(EnvironmentEnum)
  NODE_ENV: EnvironnementEnumValueType;
}

export function validateEnv(config: Record<string, unknown>) {
  const structuredConfig = {
    NESTJS_PORT: config.NESTJS_PORT,
    MONGO: {
      MONGODB_URL: config.MONGODB_URL,
      MONGO_PORT: config.MONGO_PORT,
      MONGO_USER: config.MONGO_USER,
      MONGO_PASSWORD: config.MONGO_PASSWORD,
      MONGO_TAG: config.MONGO_TAG,
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
      LOGTO_WEBHOOK_SIGNING_KEY: config.LOGTO_WEBHOOK_SIGNING_KEY,
    },
    POSTGRES: {
      POSTGRES_USER: config.POSTGRES_USER,
      POSTGRES_PASSWORD: config.POSTGRES_PASSWORD,
      POSTGRES_DB: config.POSTGRES_DB,
      POSTGRES_TAG: config.POSTGRES_TAG,
    },
    SMTP: {
      SMTP_HOST: config.SMTP_HOST,
      SMTP_PORT: config.SMTP_PORT,
      SMTP_SENDER_EMAIL: config.SMTP_SENDER_EMAIL,
      SMTP_SENDER_NAME: config.SMTP_SENDER_NAME,
      MAILHOG_TAG: config.MAILHOG_TAG,
    },
    NODE_ENV: config.NODE_ENV,
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
