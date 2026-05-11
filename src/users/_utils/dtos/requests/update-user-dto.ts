import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Optional } from 'class-validator-extended';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { toMB } from '../../../../_utils/file-size.helpers';
import { IMAGES_MIME_TYPES } from '../../../../_utils/mime-type.constants';
import { ApiProperty } from '@nestjs/swagger';
import { type UserRoleAssignableEnumValueType } from '../../types/user-role.type';
import { UserRoleAssignableEnum } from '../../enum/user-role.enum';

export class UpdateUserDto {
  @ApiProperty({
    required: false,
    example: 'diez',
    description: 'new username',
  })
  @IsString()
  @Optional()
  @IsNotEmpty()
  username?: string;

  @ApiProperty({ required: false, example: 'diez@test.fr', description: 'new email' })
  @IsEmail()
  @Optional()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({ required: false, example: UserRoleAssignableEnum.LECTOR })
  @IsEnum(UserRoleAssignableEnum)
  @Optional()
  @IsNotEmpty()
  role?: UserRoleAssignableEnumValueType;

  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
  })
  @Optional()
  @IsFile()
  @MaxFileSize(toMB(8))
  @HasMimeType(IMAGES_MIME_TYPES)
  avatar?: MemoryStoredFile;
}
