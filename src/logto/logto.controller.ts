import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { LoginOrRegister } from './_utils/decorators/loginOrRegister.decorator';
import { ConnectedUser } from '../users/_utils/decorators/connecter-user.decorator';
import type { UserDocument } from '../users/users.schema';

@Controller('logto')
export class LogtoController {
  constructor(private readonly userService: UsersService) {}

  @LoginOrRegister()
  @Get('auth')
  @ApiOperation({ summary: 'Check if user exist or register' })
  getCurrentUser(@ConnectedUser() user: UserDocument) {
    return this.userService.getUser(user);
  }
}
