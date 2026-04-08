import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    example:
      'guerre au Moyen-Orient : les Etats-Unis et l’Iran annoncent un cessez-le-fe...',
    description: 'Article Title',
  })
  @IsString({ message: 'Article title is string' })
  @IsNotEmpty({ message: 'Article title is required' })
  @Length(2, 300)
  readonly title: string;

  @ApiProperty({
    example:
      'Donald Trump a annoncé une trêve de deux semaines en échange d’une réouverture du détroit d’Ormuz. Téh cel...',
    description: 'Article Content',
  })
  @IsString({ message: 'Article title is string' })
  @IsNotEmpty({ message: 'Article title is required' })
  @Length(10, 1000)
  readonly content: string;

  @ApiProperty({
    example:
      'https://img.lemde.fr/2026/04/08/0/0/7008/4672/2000/1333/75/0/14d186c_upload-1-6i2xwfttlm3m-as106499.jpeg',
    description: 'Article Image url',
  })
  @IsString()
  @IsOptional()
  @MaxLength(300)
  readonly imageUrl: string;
}
