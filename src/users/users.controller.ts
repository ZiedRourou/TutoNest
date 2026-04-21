import { Controller, Delete, Get, HttpCode, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Protect } from '../logto/_utils/decorators/protect.decorator';
import { UserByIdPipe } from './_utils/pipes/user-by-id.pipe';
import { UserRoleEnum } from './_utils/enum/user-role.enum';
import { ConnectedUser } from './_utils/decorators/connecter-user.decorator';
import type { UserDocument } from './users.schema';

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

  @Get(':userId')
  @ApiParam({ type: 'string', name: 'userId' })
  @ApiOperation({ summary: "Get a user's information by its ID." })
  getUserById(@Param('userId', UserByIdPipe) user: UserDocument) {
    return this.usersService.getUser(user);
  }
}
