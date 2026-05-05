export class AuthorizationError extends Error {
  override name = 'AuthorizationError';
  constructor(
    message: string,
    public status = 403,
  ) {
    super(message);
  }
}
