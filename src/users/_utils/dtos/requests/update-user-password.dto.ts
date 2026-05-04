import { IsNotEmpty, IsString, IsStrongPassword, Matches } from 'class-validator';
import { Optional } from 'class-validator-extended';

export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Optional()
  oldPassword?: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 2,
    minSymbols: 1,
    minUppercase: 1,
  })
  newPassword: string;
}
