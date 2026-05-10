export const EnvironmentEnum = {
  DEVELOPMENT: 'PRODUCTION',
  PRODUCTION: 'PRODUCTION',
  LOCAL: 'LOCAL',
} as const satisfies Record<string, string>;
