import { exit } from 'process';
import { IsNumber, IsString, ValidateNested, validateSync } from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';

import { Logger } from '@nestjs/common';

export class LogtoConfig {
  @IsString()
  LOGTO_BASE_URL: string;

  @IsString()
  LOGTO_CLIENT_ID: string;

  @IsString()
  LOGTO_SECRET: string;
}

export class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION: string;

  @IsString()
  MONGODB_URL: string;

  @ValidateNested()
  @Type(() => LogtoConfig)
  LOGTO: LogtoConfig;
}

export function validateEnv(config: Record<string, unknown>) {
  const structuredConfig = {
    PORT: config.PORT,
    JWT_SECRET: config.JWT_SECRET,
    JWT_EXPIRATION: config.JWT_EXPIRATION,
    MONGODB_URL: config.MONGODB_URL,
    LOGTO: {
      LOGTO_CLIENT_ID: config.LOGTO_CLIENT_ID,
      LOGTO_BASE_URL: config.LOGTO_BASE_URL,
      LOGTO_SECRET: config.LOGTO_SECRET,
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
