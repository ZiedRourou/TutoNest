import { BadRequestException, ConflictException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../../users.schema';

export const ConnectedUser = createParamDecorator((_, ctx: ExecutionContext): UserDocument => {
  const user = ctx.switchToHttp().getRequest().auth;
  if (!user) throw new BadRequestException('user not found in context of request');
  return user;
});
