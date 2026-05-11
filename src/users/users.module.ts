import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { User, UserSchema } from './users.schema';
import { LogtoModule } from '../logto/logto.module';
import { UserExceptionsTypes } from './_utils/errors/user-exceptions.types';
import { UserByIdPipe } from './_utils/pipes/user-by-id.pipe';
import { RustfsModule } from '../rustfs/rustfs.module';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => LogtoModule),
    RustfsModule,
  ],
  providers: [UsersService, UsersRepository, UsersMapper, UserExceptionsTypes, UserByIdPipe],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository, UserByIdPipe],
})
export class UsersModule {}
