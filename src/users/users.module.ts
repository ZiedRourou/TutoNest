import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { User, UserSchema } from './users.schema';
import { UsersService } from './users.service';
import { LogtoModule } from '../logto/logto.module';
import { UserExceptionsTypes } from './_utils/errors/user-exceptions.types';

@Module({
  //forward car injection circulaire
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => LogtoModule)],
  providers: [UsersService, UsersRepository, UsersMapper, UserExceptionsTypes],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
