import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LOGTO_CLIENT_TOKEN, LOGTO_TENANT_ID } from 'src/_utils/constants';
import type { LogtoClient } from 'src/logto/_utils/types/logto.types';
import { LogtoResponseType, LogtoUser } from 'src/logto/_utils/types/responses/responses.type';
import { LogtoExceptions } from './_utils/errors/logto-exceptions.types';
import { GetUsersQuery } from './_utils/types/requests/get-users-query.types';

@Injectable()
export class LogtoRequests {
  constructor(
    @Inject(LOGTO_CLIENT_TOKEN) private readonly logtoClient: LogtoClient,
    private readonly exceptions: LogtoExceptions,
  ) {}

  /**
   * GET /api/users/{userId}
   * Fetch user information by user ID.
   * @link https://openapi.logto.io/operation/operation-getuser
   * @param userId
   * @returns User information
   */
  fetchUserInformations = (userId: string) =>
    this.handleResponse(
      this.logtoClient.GET(`/api/users/{userId}`, {
        params: {
          path: { userId: userId },
        },
      }),
      this.exceptions.ERROR_FETCH_USER_INFORMATIONS,
    );

  /**
   * POST /api/users/{userId}/password/verify
   * Verify user password.
   * @link https://openapi.logto.io/operation/operation-verifyuserpassword
   * @param userId
   * @param password
   * @returns Success response
   */
  verifyUserPassword = (userId: string, password: string) =>
    this.handleResponse(
      this.logtoClient.POST(`/api/users/{userId}/password/verify`, {
        params: {
          path: { userId: userId },
        },
        body: {
          password,
        },
      }),
      this.exceptions.ERROR_VERIFY_USER_PASSWORD,
    );

  /**
   * PATCH /api/users/{userId}/password
   * Update user password.
   * @link https://openapi.logto.io/operation/operation-updateuserpassword
   * @param userId
   * @param password
   * @returns Success response
   */
  updateUserPassword = (userId: string, password: string) =>
    this.handleResponse(
      this.logtoClient.PATCH(`/api/users/{userId}/password`, {
        params: {
          path: { userId: userId },
        },
        body: {
          password,
        },
      }),
      this.exceptions.ERROR_UPDATE_USER_PASSWORD,
    );

  /**
   * DELETE /api/users/{userId}
   * Delete a user by user ID.
   * @link https://openapi.logto.io/operation/operation-deleteuser
   * @param userId
   * @returns Success response
   */
  deleteUser = (userId: string) =>
    this.handleResponse(
      this.logtoClient.DELETE(`/api/users/{userId}`, {
        params: {
          path: { userId: userId },
        },
      }),
      this.exceptions.ERROR_DELETE_USER,
    );

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

    if (!res.data) {
      throw error || this.exceptions.DEFAULT_LOGTO_ERROR;
    }
    return res.data;
  };

  getUsers = (query?: GetUsersQuery): Promise<LogtoUser[]> => {
    return this.handleResponse<LogtoUser[]>(
      this.logtoClient.GET('/api/users', {
        params: {
          query,
        },
      }),
      this.exceptions.ERROR_FETCH_USER_INFORMATIONS,
    );
  };
}
