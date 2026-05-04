import { ApiProperty } from '@nestjs/swagger';

export class GetArticleWithStatsDto {
  @ApiProperty()
  commentsCount: number;
}
