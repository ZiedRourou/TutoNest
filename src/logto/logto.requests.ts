import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LOGTO_CLIENT_TOKEN } from 'src/_utils/constants';
import type { LogtoClient } from 'src/logto/_utils/types/logto.types';
import { LogtoResponseType } from 'src/logto/_utils/types/responses/responses.type';
import { LogtoExceptions } from './_utils/errors/logto-exceptions.types';
import { MongoId } from '../_utils/types/mongo-id.type';

@Injectable()
export class LogtoRequests {
  constructor(
    @Inject(LOGTO_CLIENT_TOKEN) private readonly logtoClient: LogtoClient,
    private readonly exceptions: LogtoExceptions,
  ) {}

  deleteUser(userId: MongoId) {
    return this.handleResponse(
      this.logtoClient.DELETE(`/api/users/{userId}`, {
        params: { path: { userId: userId.toString() } },
      }),
      this.exceptions.ERROR_DELETE_USER,
    );
  }

  fetchUserInformations(userId: MongoId) {
    return this.handleResponse(
      this.logtoClient.GET(`/api/users/{userId}`, {
        params: {
          path: { userId: userId.toString() },
        },
      }),
      this.exceptions.DEFAULT_LOGTO_ERROR,
    );
  }

  verifyUserPassword(userId: MongoId, password: string) {
    return this.handleResponse(
      this.logtoClient.POST(`/api/users/{userId}/password/verify`, {
        params: {
          path: { userId: userId.toString() },
        },
        body: {
          password,
        },
      }),
      this.exceptions.ERROR_LOGTO_PASSWORD_VERIFY,
    );
  }

  updateUserPassword(userId: MongoId, password: string) {
    return this.handleResponse(
      this.logtoClient.PATCH(`/api/users/{userId}/password`, {
        params: {
          path: { userId: userId.toString() },
        },
        body: {
          password,
        },
      }),
      this.exceptions.ERROR_UPDATE_USER_PASSWORD,
    );
  }

  updateUserProfilePicture(userId: string, profilePictureUrl: string) {
    return this.handleResponse(
      this.logtoClient.PATCH('/api/users/{userId}', {
        params: {
          path: { userId },
        },
        body: {
          avatar: profilePictureUrl,
        },
      }),
      this.exceptions.ERROR_UPDATE_USER_AVATAR,
    );
  }

  getRoles() {
    return this.handleResponse(this.logtoClient.GET(`/api/roles`, {}), this.exceptions.DEFAULT_LOGTO_ERROR);
  }

  updateRoleToUser(userId: MongoId, roleIds: string[]) {
    return this.handleResponse(
      this.logtoClient.PUT(`/api/users/{userId}/roles`, {
        params: { path: { userId: userId.toString() } },
        body: { roleIds },
      }),
      this.exceptions.ERROR_UPDATE_USER_ROLE,
    );
  }

  private handleResponse = <T>(
    promise: Promise<LogtoResponseType<T>>,
    error?: BadRequestException | InternalServerErrorException,
  ): Promise<T> =>
    promise
      .then(res => this.resOrThrow(res, error))
      .catch(err => {
        if (
          err.message?.includes('Unexpected token') &&
          (err.message?.includes('Created') || err.message?.includes('"C"'))
        ) {
          return { success: true } as T;
        }
        throw error || err;
      });

  private resOrThrow = <T>(
    res: LogtoResponseType<T>,
    error?: BadRequestException | InternalServerErrorException,
  ): T => {
    if (res.response && res.response.status >= 200 && res.response.status < 300) {
      return res.data || ({ success: true } as T);
    }

    if (res.response?.status) {
      const status = res.response.status;
      const errorMessage = error?.message || 'Request failed';
      this.throwError(status, errorMessage);
    }

    if (!res.data) {
      throw error || this.exceptions.DEFAULT_LOGTO_ERROR;
    }
    return res.data;
  };

  private throwError(status: number, errorMessage: string) {
    switch (status) {
      case 400:
        throw new BadRequestException(errorMessage);
      case 401:
        throw new UnauthorizedException(errorMessage);
      case 403:
        throw new ForbiddenException(errorMessage);
      case 404:
        throw new NotFoundException(errorMessage);
      case 409:
        throw new BadRequestException(errorMessage);
      default:
        if (status >= 500) {
          throw new InternalServerErrorException(errorMessage);
        }
    }
  }
}
