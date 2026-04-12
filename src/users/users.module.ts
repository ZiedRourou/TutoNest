import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { UsersController } from './users.controller';
import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { User, UserSchema } from './users.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => JwtModule),
    EncryptionModule,
  ],
  providers: [UsersService, UsersRepository, UsersMapper],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
