export const EnvironmentEnum = {
  DEVELOPMENT: 'DEVELOPMENT',
  PRODUCTION: 'PRODUCTION',
  LOCAL: 'LOCAL',
} as const satisfies Record<string, string>;
