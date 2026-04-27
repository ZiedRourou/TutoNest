import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Protect } from '../logto/_utils/decorators/protect.decorator';
import { UserByIdPipe } from './_utils/pipes/user-by-id.pipe';
import { UserRoleEnum } from './_utils/enum/user-role.enum';
import { ConnectedUser } from './_utils/decorators/connecter-user.decorator';
import type { UserDocument } from './users.schema';
import { NewUserRoleDto } from './_utils/dtos/requests/new-user-role.dto';

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
  @Patch('role')
  @ApiOperation({ summary: 'Choose role' })
  @ApiBody({ type: NewUserRoleDto })
  updateUserRole(@ConnectedUser() user: UserDocument, @Body() newRole: NewUserRoleDto) {
    return this.usersService.updateUserRole(user, newRole);
  }

  @Delete('delete')
  @Protect()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete my account' })
  deleteUserMe(@ConnectedUser() user: UserDocument) {
    return this.usersService.deleteUser(user);
  }

  @Delete(':userId')
  @Protect({ roles: [UserRoleEnum.ADMIN] })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ type: 'string', name: 'userId' })
  @ApiOperation({ summary: 'Delete user by id' })
  deleteUser(@Param('userId', UserByIdPipe) user: UserDocument) {
    return this.usersService.deleteUser(user);
  }
}
