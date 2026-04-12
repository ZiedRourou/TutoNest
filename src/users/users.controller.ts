import { Controller, Delete, Get, HttpCode, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Protect } from '../auth/_utils/decorator/protect.decorator';
import * as usersSchema from './users.schema';
import { UserByIdPipe } from './_utils/user-by-id.pipe';
import { UserRoleEnum } from './_utils/user-role.enum';
import { ConnectedUser } from './_utils/decorator/connecter-user.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Protect()
  @Get('me')
  @ApiOperation({ summary: "Get the current user's information." })
  getCurrentUser(@ConnectedUser() user: usersSchema.UserDocument) {
    return this.usersService.getUser(user);
  }

  @Protect(UserRoleEnum.ADMIN)
  @Get(':userId')
  @ApiParam({ type: 'string', name: 'userId' })
  @ApiOperation({ summary: "Get a user's information by its ID." })
  getUserById(@Param('userId', UserByIdPipe) user: usersSchema.UserDocument) {
    return this.usersService.getUser(user);
  }
}
