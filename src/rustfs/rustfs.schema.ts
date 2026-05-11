import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class RustfsFile {
  @Prop({ required: true })
  bucket: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  sizeBytes: number;

  updatedAt: Date;

  createdAt: Date;
}

export const RustfsFileSchema = SchemaFactory.createForClass(RustfsFile);
