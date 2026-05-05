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
    minLength: 15, //norme
  })
  newPassword: string;
}
