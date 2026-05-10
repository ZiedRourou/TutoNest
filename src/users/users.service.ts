import { UsersMapper } from './users.mapper';
import { UsersRepository } from './users.repository';
import { UserDocument } from './users.schema';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LogtoService } from '../logto/logto.service';
import { UserExceptionsTypes } from './_utils/errors/user-exceptions.types';
import { LogtoUser } from '../logto/_utils/types/responses/responses.type';
import { UpdateUserDto } from './_utils/dtos/requests/update-user-dto';
import { LogtoRequests } from '../logto/logto.requests';
import { MongoId } from '../_utils/types/mongo-id.type';
import { UpdateUserPasswordDto } from './_utils/dtos/requests/update-user-password.dto';
import { LogtoId } from '../logto/_utils/types/logto.types';
import { RustfsService } from '../rustfs/rustfs.service';
import { RustfsMapper } from '../rustfs/rustfs.mapper';
import { RustfsFile } from '../rustfs/rustfs.schema';

@Injectable()
class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersMapper: UsersMapper,
    @Inject(forwardRef(() => LogtoService))
    private readonly logtoService: LogtoService,
    private readonly userException: UserExceptionsTypes,
    private readonly logtoRequests: LogtoRequests,
    private readonly rustfsService: RustfsService,
    private readonly rustfsMapper: RustfsMapper,
  ) {}

  getUser(user: UserDocument) {
    return this.usersMapper.toGetUserDto(user);
  }

  async findUserOrFail(userLogtoId: LogtoId) {
    return await this.usersRepository.findOneByIdOrThrow(userLogtoId);
  }

  async findOrCreateUser(logtoUser: LogtoUser) {
    const existing = await this.usersRepository.userWithLogtoIdExist(logtoUser.id);

    if (existing) {
      return existing;
    }

    return await this.usersRepository.createUser(logtoUser);
  }

  async updateUserByLogtoId(logtoId: LogtoId, updateData: UpdateUserDto) {
    await this.usersRepository.updateByLogtoId(logtoId, updateData);
    return;
  }

  async removeUserByLogtoId(logtoId: LogtoId) {
    const result = await this.usersRepository.deleteByLogtoId(logtoId);

    if (!result) {
      throw this.userException.ERROR_NOT_FOUND_USER;
    }
  }

  async updateAccount(user: UserDocument, dto: UpdateUserDto) {
    // j'ai fait l'upload de l'avatar et j'ai récupérer les info (rustflfile)
    //j'envoi l'url  a logto pour save
    // mais je save l'image localement ici plutôt qu'en attendant le webhook
    //tu en pense quoi

    const uploadImage = await this.updateAvatar(user, dto);

    await this.updateRole(user, dto);

    const avatar = uploadImage ?? null;
    await this.logtoService.updateAccount(user, dto);
    await this.usersRepository.updateUser(user.id, { ...dto, avatar });

    //je return le user ?
    return;
  }

  async updateUserPassword(user: LogtoUser, updateUserPasswordDto: UpdateUserPasswordDto) {
    if (user.hasPassword && !updateUserPasswordDto.oldPassword) {
      throw this.userException.ERROR_OLD_PASSWORD_REQUIRED;
    }

    await this.logtoService.updatePassword(user, updateUserPasswordDto);
    return;
  }

  async deleteAccount(user: LogtoUser) {
    await this.logtoService.deleteUser(user);
    return;
  }

  private async updateAvatar(user: UserDocument, dto: UpdateUserDto) {
    if (!dto.avatar) return undefined;

    const uploadImage = await this.rustfsService.uploadFile(
      dto.avatar,
      null,
      this.rustfsMapper.toUserProfilePictureKey(user.id, dto.avatar.extension),
    );

    await this.logtoRequests.updateUserProfilePicture(
      user.userLogtoId,
      this.rustfsMapper.toGetProfilePictureUrl(user.id, dto.avatar.extension),
    );

    return uploadImage;
  }

  //je peux appeler logto request ici ou je passe par le service ?
  private async updateRole(user: UserDocument, dto: UpdateUserDto): Promise<void> {
    if (!dto.role) return;

    const allRoles = await this.logtoRequests.getRoles();
    const newRole = allRoles.find(role => role.name === dto.role);

    if (!newRole) throw this.userException.ERROR_NOT_FOUND_ROLE_LOGTO;
    await this.logtoRequests.updateRoleToUser(user.userLogtoId, [newRole.id]);
  }
}

export default UsersService;
