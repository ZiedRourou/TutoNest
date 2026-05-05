export const EnvironmentEnum = {
  Development: 'development',
  Production: 'production',
  Test: 'test',
} as const satisfies Record<string, string>;
