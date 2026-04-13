import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { UserRoleEnum } from '../../enum/user-role.enum';
import type { UserRoleType } from '../../enum/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'zied@dev-id.fr' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Test1234**' })
  @IsStrongPassword({
    minLength: 4,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;

  @ApiProperty()
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsEnum(UserRoleEnum)
  role: UserRoleType;
}
