import { S3Client } from '@aws-sdk/client-s3';
import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables, RustfsConfig } from '../_utils/config/env.config';
import { RUSTFS_CLIENT_TOKEN } from '../_utils/constants';

export const rustfsProviders: Provider[] = [
  {
    provide: RUSTFS_CLIENT_TOKEN,
    useFactory: async (configService: ConfigService<EnvironmentVariables, true>) => {
      const rustfsConfig = configService.get<RustfsConfig>('RUSTFS');
      try {
        return new S3Client({
          endpoint: rustfsConfig.RUSTFS_ENDPOINT,
          region: 'eu-west-2',
          credentials: {
            accessKeyId: rustfsConfig.RUSTFS_ACCESS_KEY,
            secretAccessKey: rustfsConfig.RUSTFS_SECRET_KEY,
          },
          forcePathStyle: true,
        });
      } catch (error) {
        throw error;
      }
    },
    inject: [ConfigService],
  },
];
