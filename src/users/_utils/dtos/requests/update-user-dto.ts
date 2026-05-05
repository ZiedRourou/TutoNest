import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Optional } from 'class-validator-extended';

export class UpdateAccountDto {
  @IsString()
  @Optional()
  @IsNotEmpty()
  username?: string;

  @IsEmail()
  @Optional()
  @IsNotEmpty()
  email?: string;
}
