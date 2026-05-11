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
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { EnvironmentVariables, RustfsConfig } from '../_utils/config/env.config';
import { RUSTFS_CLIENT_TOKEN } from '../_utils/constants';
import { RustfsExceptionsTypes } from './_utils/errors/rustfs-exceptions.types';
import { FileUploads, PartType } from './_utils/types/file-upload.type';
import { RustfsFile } from './rustfs.schema';

@Injectable()
export class RustfsService {
  private readonly BUCKET_NAME: string;
  private readonly CHUNK_SIZE = 5 * 1024 * 1024;
  private readonly exceptions: RustfsExceptionsTypes;

  constructor(
    @Inject(RUSTFS_CLIENT_TOKEN) private readonly s3Client: S3Client,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly logger: Logger,
  ) {
    this.BUCKET_NAME = this.configService.get<RustfsConfig>('RUSTFS').RUSTFS_BUCKET_NAME;
  }

  uploadFile(file: FileUploads) {
    const { fileOrBuffer, fileName, key } = file;
    let bucket = file.bucket;
    const buffer = fileOrBuffer.buffer;
    const size = fileOrBuffer.size;
    const mimetype = fileOrBuffer.mimetype;
    const originalName = fileName ?? fileOrBuffer.originalName;

    if (!bucket) bucket = this.BUCKET_NAME;

    if (size <= this.CHUNK_SIZE) {
      return this.uploadSinglePart({ bucket, key, buffer, mimetype, originalName, size });
    }
    return this.uploadMultipart({ bucket, key, buffer, mimetype, originalName, size });
  }

  private async uploadSinglePart(part: PartType) {
    const { buffer, mimetype, originalName, size, bucket, key } = part;

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
        updatedAt: new Date(),
        sizeBytes: size,
      };
    } catch (error) {
      if (error.name === 'NoSuchBucket') {
        if (!bucket) throw this.exceptions.ERROR__MULTIPART_UPLOAD;
        await this.createBucket(bucket);
        return this.s3Client?.send(command).then(() => ({
          bucket: bucket,
          key: key,
          fileName: originalName,
          mimeType: mimetype,
          createdAt: new Date(),
          updatedAt: new Date(),
          sizeBytes: size,
        }));
      }
      throw error;
    }
  }

  private async uploadMultipart(part: PartType) {
    let uploadId: string | undefined;
    const { buffer, mimetype, originalName, size, bucket, key } = part;
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
        updatedAt: new Date(),
        sizeBytes: size,
      };
    } catch (error) {
      if (error.name === 'NoSuchBucket') {
        if (!bucket) throw this.exceptions.ERROR__MULTIPART_UPLOAD;
        await this.createBucket(bucket);
        return await this.uploadMultipart({
          bucket,
          key,
          buffer,
          mimetype,
          originalName,
          size,
        });
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
}
