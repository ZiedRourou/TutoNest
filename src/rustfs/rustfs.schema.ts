import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ _id: false })
export class RustfsFile {
  @Prop({ required: true })
  bucket: string

  @Prop({ required: true })
  key: string

  @Prop({ required: true })
  fileName: string

  @Prop({ required: true })
  mimeType: string

  @Prop({ required: true })
  createdAt: Date

  @Prop({ required: true })
  size: number
}

export const RustfsFileSchema = SchemaFactory.createForClass(RustfsFile)
