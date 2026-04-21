import { LogtoRequests } from '../../../logto.requests';

export type LogtoResponseType<T> = {
  data?: T;
  error?: unknown;
  response?: Response;
};

export type LogtoUser = NonNullable<Awaited<ReturnType<LogtoRequests['fetchUserInformations']>>>;
