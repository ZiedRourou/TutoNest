import { MemoryStoredFile } from 'nestjs-form-data';

export type FileUpload = {
  fileOrBuffer: MemoryStoredFile;
  bucket?: string;
  key: string;
  fileName?: string;
};

export type BaseFile = {
  bucket?: string;
  key: string;
};

export type PartType = BaseFile & {
  buffer: Buffer;
  mimetype: string;
  originalName: string;
  size: number;
};

export type FileUploads = BaseFile & {
  fileOrBuffer: MemoryStoredFile;
  fileName?: string;
  mimeType?: string;
};
