import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class RustfsExceptionsTypes {
  ERROR__MULTIPART_UPLOAD = new BadRequestException('Failed to initiate multipart upload');
}
