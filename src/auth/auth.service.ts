import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './_utils/dto/request/login.dto';

import { UsersRepository } from 'src/users/users.repository';
import { UserDocument } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { EncryptionService } from '../encryption/encryption.service';
import JwtPayloadInterface from './_utils/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserDocument> {
    const user = await this.usersRepository.findOneByEmailOrThrow(email);

    const passwordStatus = await this.encryptionService.compare(pass, user.password);
    if (!passwordStatus.isPasswordCorrect) throw new UnauthorizedException('WRONG_CREDENTIALS');
    if (passwordStatus.isEncryptionChanged) {
      await this.usersRepository.updatePasswordById(user._id, pass);
    }

    return user;
  }

  async login(login: LoginDto) {
    const user = await this.validateUser(login.email, login.password);

    const payload: JwtPayloadInterface = { email: user.email, id: user._id.toString(), role: user.role };
    return { accessToken: this.jwtService.sign(payload), user: this.usersService.getUser(user) };
  }
}
