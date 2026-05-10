export type BucketItemStats = {
  size: number | undefined
  metaData: Record<string, string> | undefined
  lastModified: Date | undefined
  etag: string | undefined
  contentType: string | undefined
}
