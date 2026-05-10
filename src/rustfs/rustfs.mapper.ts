import { Injectable } from '@nestjs/common';
import { EnvironmentVariables, RustfsConfig } from '../_utils/config/env.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RustfsMapper {
  private readonly BUCKET_NAME: string;
  private readonly BUCKET_CONFIG: RustfsConfig;

  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {
    this.BUCKET_NAME = this.configService.get<RustfsConfig>('RUSTFS').RUSTFS_BUCKET_NAME;
    this.BUCKET_CONFIG = this.configService.get<RustfsConfig>('RUSTFS');
  }

  toUserProfilePictureKey = (userId: string, ext: string): string => `public/users/pfp/${userId}-avatar.${ext}`;
  toGetProfilePictureUrl = (userId: string, ext: string): string =>
    `${this.BUCKET_CONFIG.RUSTFS_ENDPOINT}/${this.BUCKET_NAME}/public/users/pfp/${userId}-avatar.${ext}`;
}
