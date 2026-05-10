import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CopyObjectCommand,
  CreateBucketCommand,
  CreateMultipartUploadCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { EnvironmentVariables, RustfsConfig } from '../_utils/config/env.config';
import { RUSTFS_CLIENT_TOKEN } from '../_utils/constants';
import { MemoryStoredFile } from 'nestjs-form-data';
import { RustfsFile } from './rustfs.schema';
import { RustfsExceptionsTypes } from './_utils/errors/rustfs-exceptions.types';

@Injectable()
export class RustfsService {
  private readonly BUCKET_NAME: string;
  private readonly RUSTFS_PRESIGNED_URL_EXPIRATION_TIME = 3600;
  private readonly CHUNK_SIZE = 5 * 1024 * 1024;
  private readonly exceptions: RustfsExceptionsTypes;

  constructor(
    @Inject(RUSTFS_CLIENT_TOKEN) private readonly s3Client: S3Client,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly logger: Logger,
  ) {
    this.BUCKET_NAME = this.configService.get<RustfsConfig>('RUSTFS').RUSTFS_BUCKET_NAME;
  }

  uploadFile = async (
    fileOrBuffer: MemoryStoredFile,
    bucket: string | null,
    key: string,
    fileName?: string,
  ): Promise<RustfsFile | undefined> => {
    const buffer = fileOrBuffer.buffer;
    const size = fileOrBuffer.size;
    const mimetype = fileOrBuffer.mimetype;
    const originalName = fileName ?? fileOrBuffer.originalName;

    if (!bucket) bucket = this.BUCKET_NAME;

    if (size <= this.CHUNK_SIZE) {
      return this.uploadSinglePart(bucket, key, buffer, mimetype, originalName, size);
    }
    return this.uploadMultipart(bucket, key, buffer, mimetype, originalName, size);
  };

  private uploadSinglePart = async (
    bucket: string,
    key: string,
    buffer: Buffer,
    mimetype: string,
    originalName: string,
    size: number,
  ): Promise<RustfsFile | undefined> => {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    });

    try {
      await this.s3Client?.send(command);

      return {
        bucket: bucket,
        key: key,
        fileName: originalName,
        mimeType: mimetype,
        createdAt: new Date(),
        size: size,
      };
    } catch (error) {
      if (error.name === 'NoSuchBucket') {
        await this.createBucket(bucket);
        return this.s3Client?.send(command).then(() => ({
          bucket: bucket,
          key: key,
          fileName: originalName,
          mimeType: mimetype,
          createdAt: new Date(),
          size: size,
        }));
      }
      throw error;
    }
  };

  private uploadMultipart = async (
    bucket: string,
    key: string,
    buffer: Buffer,
    mimetype: string,
    originalName: string,
    size: number,
  ): Promise<RustfsFile | undefined> => {
    let uploadId: string | undefined;
    const parts: { ETag: string; PartNumber: number }[] = [];

    try {
      const createCommand = new CreateMultipartUploadCommand({
        Bucket: bucket,
        Key: key,
        ContentType: mimetype,
      });

      const createResponse = await this.s3Client?.send(createCommand);
      uploadId = createResponse?.UploadId;

      if (!uploadId) {
        throw this.exceptions.ERROR__MULTIPART_UPLOAD;
      }

      const totalChunks = Math.ceil(size / this.CHUNK_SIZE);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * this.CHUNK_SIZE;
        const end = Math.min(start + this.CHUNK_SIZE, size);
        const chunk = buffer.slice(start, end);

        const uploadCommand = new UploadPartCommand({
          Bucket: bucket,
          Key: key,
          UploadId: uploadId,
          PartNumber: i + 1,
          Body: chunk,
        });

        const response = await this.s3Client?.send(uploadCommand);

        if (response.ETag) {
          parts.push({
            ETag: response.ETag,
            PartNumber: i + 1,
          });
        }
      }

      const completeCommand = new CompleteMultipartUploadCommand({
        Bucket: bucket,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: parts,
        },
      });

      await this.s3Client?.send(completeCommand);

      return {
        bucket: bucket,
        key: key,
        fileName: originalName,
        mimeType: mimetype,
        createdAt: new Date(),
        size: size,
      };
    } catch (error) {
      if (error.name === 'NoSuchBucket') {
        await this.createBucket(bucket);
        return await this.uploadMultipart(bucket, key, buffer, mimetype, originalName, size);
      }

      if (uploadId) {
        try {
          const abortCommand = new AbortMultipartUploadCommand({
            Bucket: bucket,
            Key: key,
            UploadId: uploadId,
          });
          await this.s3Client?.send(abortCommand);
        } catch {}
      }

      throw error;
    }
  };

  async getPresignedUrl(key: string, bucket?: string) {
    // Bucket should never be undefined, but verification is made to avoid breaking changes with old system (condition may be deleted on new deployment + S3 reset)
    if (!bucket) bucket = this.BUCKET_NAME;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: this.RUSTFS_PRESIGNED_URL_EXPIRATION_TIME,
    });
  }

  async getStats(objectKey: string, bucket?: string) {
    if (!bucket) bucket = this.BUCKET_NAME;

    try {
      const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: objectKey,
      });

      const response = await this.s3Client.send(command);

      return {
        size: response.ContentLength,
        metaData: response.Metadata,
        lastModified: response.LastModified,
        etag: response.ETag,
        contentType: response.ContentType,
      };
    } catch (error) {
      if (error.name === 'NotFound') {
        return null;
      }
      throw error;
    }
  }

  async getFile(key: string, bucket?: string) {
    // Bucket should never be undefined, but verification is made to avoid breaking changes with old system (condition may be deleted on new deployment + S3 reset)
    if (!bucket) bucket = this.BUCKET_NAME;

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const response = await this.s3Client.send(command);
    return response.Body as Readable;
  }

  copyFile(sourceKey: string, destinationKey: string, bucket: string) {
    const command = new CopyObjectCommand({
      Bucket: bucket,
      Key: destinationKey,
      CopySource: encodeURI(`${bucket}/${sourceKey}`),
    });

    return this.s3Client.send(command);
  }

  deleteFiles(keys: string[], bucket: string) {
    const command = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: keys.map(key => ({ Key: key })),
        Quiet: false,
      },
    });

    return this.s3Client.send(command);
  }

  async createBucket(name: string) {
    const command = new CreateBucketCommand({
      Bucket: name,
    });

    return this.s3Client.send(command);
  }

  async createBucketIfNotExists(bucketName: string) {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    } catch (error) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        try {
          await this.s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
          this.logger.log(`Bucket has been created`, RUSTFS_CLIENT_TOKEN);
        } catch (createError) {
          if (createError.name !== 'BucketAlreadyOwnedByYou') {
            throw createError;
          }
        }
      } else {
        throw error;
      }
    }
  }

  async copyPrefix(source: string, destinationPrefix: string, bucket?: string) {
    if (!bucket && source.includes('/')) {
      const [srcBucket, ...keyParts] = source.split('/');
      bucket = srcBucket;
      source = keyParts.join('/');
    }
    const src = source.endsWith('/') ? source : `${source}/`;

    const [dstBucket, ...dstKeyParts] = destinationPrefix.split('/');
    const dstKey = dstKeyParts.join('/');
    const dst = dstKey.endsWith('/') ? dstKey : `${dstKey}/`;

    let continuationToken: string | undefined;
    do {
      const listResponse = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: src,
          ContinuationToken: continuationToken,
        }),
      );
      const objects = listResponse.Contents ?? [];
      const copyTasks = objects.map(object => {
        if (!object.Key || object.Key.endsWith('/')) return Promise.resolve();
        const newKey = object.Key.replace(src, dst);
        return this.s3Client.send(
          new CopyObjectCommand({
            Bucket: dstBucket,
            Key: newKey,
            CopySource: encodeURI(`${bucket}/${object.Key}`),
          }),
        );
      });
      await Promise.all(copyTasks);
      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);
  }

  async getFolderSize(prefix: string, bucket?: string): Promise<number> {
    // in bytes
    if (!bucket && prefix.includes('/')) {
      const [srcBucket, ...keyParts] = prefix.split('/');
      bucket = srcBucket;
      prefix = keyParts.join('/');
    }

    if (!bucket) bucket = this.BUCKET_NAME;

    const normalizedPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;
    let totalSize = 0;
    let continuationToken: string | undefined;

    do {
      const listResponse = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: normalizedPrefix,
          ContinuationToken: continuationToken,
        }),
      );

      for (const object of listResponse.Contents ?? []) {
        totalSize += object.Size ?? 0;
      }

      continuationToken = listResponse.NextContinuationToken;
    } while (continuationToken);

    return totalSize;
  }
}
