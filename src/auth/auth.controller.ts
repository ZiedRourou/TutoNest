import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './_utils/dtos/requests/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/_utils/dtos/requests/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register users.' })
  register(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login users.' })
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
