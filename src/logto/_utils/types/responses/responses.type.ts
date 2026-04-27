import { LogtoRequests } from '../../../logto.requests';

export type LogtoResponseType<T> = {
  data?: T;
  error?: unknown;
  response?: Response;
};
