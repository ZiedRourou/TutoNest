import { Schema } from 'effect';

const LogtoUserCustomClaim = Schema.Struct({
  role: Schema.required(Schema.String),
  username: Schema.required(Schema.String),
  userLogtoId: Schema.required(Schema.String),
});

export const JWTPayloadSchema = Schema.Struct({
  /**
   * JWT Subject
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2 RFC7519#section-4.1.2}
   */
  sub: Schema.String.pipe(Schema.nonEmptyString()),

  /**
   * JWT Issuer
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1 RFC7519#section-4.1.1}
   */
  iss: Schema.optional(Schema.String),
  /**
   * JWT Audience
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3 RFC7519#section-4.1.3}
   */
  aud: Schema.optional(Schema.Union(Schema.String, Schema.Array(Schema.String))),
  /**
   * JWT ID
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7 RFC7519#section-4.1.7}
   */
  jti: Schema.optional(Schema.String),
  /**
   * JWT Not Before
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5 RFC7519#section-4.1.5}
   */
  nbf: Schema.optional(Schema.Number),
  /**
   * JWT Expiration Time
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4 RFC7519#section-4.1.4}
   */
  exp: Schema.optional(Schema.Number),
  /**
   * JWT Issued At
   *
   * @see {@link https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6 RFC7519#section-4.1.6}
   */
  iat: Schema.optional(Schema.Number),
});

const LogtoBasePayloadSchema = Schema.Struct({
  /**
   * The scopes of the token
   *
   * @see {@link https://docs.logto.io/developers/custom-token-claims/create-script}
   */
  scope: Schema.optional(Schema.String),
  /**
   * The client id of the token
   *
   * @see {@link https://docs.logto.io/developers/custom-token-claims/create-script}
   */
  client_id: Schema.optional(Schema.String),
  /**
   * The user id of the token
   *
   * @see {@link https://docs.logto.io/developers/custom-token-claims/create-script}
   */
  accountId: Schema.optional(Schema.String),
  /**
   * Whether the token will expire with the session
   *
   * @see {@link https://docs.logto.io/developers/custom-token-claims/create-script}
   */
  expiresWithSession: Schema.optional(Schema.String),
  /**
   * The current authentication grant id of the token
   *
   * @see {@link https://docs.logto.io/developers/custom-token-claims/create-script}
   */
  grantId: Schema.optional(Schema.String),
  /**
   * The grant type of the token
   *
   * @see {@link https://docs.logto.io/developers/custom-token-claims/create-script}
   */
  gty: Schema.optional(Schema.String),
  /**
   * The token kind (AccessToken)
   *
   * @see {@link https://docs.logto.io/developers/custom-token-claims/create-script}
   */
  kind: Schema.optional(Schema.String),
});

const LogtoPayloadSchema = JWTPayloadSchema.pipe(
  Schema.extend(LogtoUserCustomClaim),
  Schema.extend(LogtoBasePayloadSchema),
);

export type LogtoPayload = Schema.Schema.Type<typeof LogtoPayloadSchema>;
export const decodeLogtoPayload = Schema.decodeUnknownSync(LogtoPayloadSchema);
