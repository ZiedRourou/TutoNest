import { IsString } from 'class-validator';

export class BasicMailDataDto {
  @IsString()
  name: string = 'test';

  @IsString()
  email: string = 'email@email.com';

  @IsString()
  content: string = 'coucou les loulous';
}
