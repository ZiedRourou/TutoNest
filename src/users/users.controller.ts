import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Protect } from '../logto/_utils/decorators/protect.decorator';
import { UserByIdPipe } from './_utils/pipes/user-by-id.pipe';
import { UserRoleEnum } from './_utils/enum/user-role.enum';
import { ConnectedUser } from './_utils/decorators/connecter-user.decorator';
import type { UserDocument } from './users.schema';
import * as responsesType from '../logto/_utils/types/responses/responses.type';
import type { LogtoUser } from '../logto/_utils/types/responses/responses.type';
import { UpdateAccountDto } from './_utils/dtos/requests/update-user-dto';
import { UpdateUserPasswordDto } from './_utils/dtos/requests/update-user-password.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Protect()
  @Get('me')
  @ApiOperation({ summary: "Get the current user's information." })
  getCurrentUser(@ConnectedUser() user: UserDocument) {
    return this.usersService.getUser(user);
  }

  @Protect({ roles: [UserRoleEnum.ADMIN] })
  @Get(':userId')
  @ApiParam({ type: 'string', name: 'userId' })
  @ApiOperation({ summary: "Get a user's information by its ID." })
  getUserById(@Param('userId', UserByIdPipe) user: UserDocument) {
    return this.usersService.getUser(user);
  }

  @Protect()
  @Patch('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  updateAccount(@ConnectedUser() user: LogtoUser, @Body() dto: UpdateAccountDto) {
    //pour le role je sais toujours pas qui faire le front doit pas plutot envoyer l'id du role directement ?
    return this.usersService.updateAccount(user, dto);
  }

  @Protect()
  @Patch('password')
  @ApiOperation({ summary: 'Update the connected user password' })
  @HttpCode(HttpStatus.NO_CONTENT)
  updateUserPassword(
    @ConnectedUser() user: responsesType.LogtoUser,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.usersService.updateUserPassword(user, updateUserPasswordDto);
  }

  @Protect()
  @Delete('me')
  @ApiOperation({ summary: 'Delete the connected user account' })
  @ApiResponse({ status: 204, description: 'Account successfully deleted' })
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAccount(@ConnectedUser() user: LogtoUser) {
    return this.usersService.deleteAccount(user);
  }
}
