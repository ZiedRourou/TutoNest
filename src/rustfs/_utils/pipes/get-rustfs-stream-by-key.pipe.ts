import { Readable } from 'node:stream'
import { Injectable, PipeTransform } from '@nestjs/common'
import { RustfsService } from 'src/rustfs/rustfs.service'
import { BucketItemStats } from '../types/bucket-item-stats.type'

export interface RustfsFilePipeResult {
  stats: BucketItemStats
  stream: Readable
}

@Injectable()
export class GetRustfsStreamByKeyPipe implements PipeTransform<string, Promise<RustfsFilePipeResult>> {
  constructor(private readonly rustfsService: RustfsService) {}

  async transform(rustfsKey: string): Promise<RustfsFilePipeResult> {
    const [stats, file] = await Promise.all([
      this.rustfsService.getStats(rustfsKey),
      this.rustfsService.getFile(rustfsKey),
    ])

    return {
      stats: stats ?? { size: 0, metaData: {}, lastModified: new Date(), etag: '', contentType: '' },
      stream: file!,
    }
  }
}
