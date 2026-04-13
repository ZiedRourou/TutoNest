export const ArticleCategoryEnum = {
  TECH: 'tech',
  POLITIC: 'politic',
  BUSINESS: 'business',
  NEWS: 'news',
} as const;

export type ArticleCategoryType = (typeof ArticleCategoryEnum)[keyof typeof ArticleCategoryEnum];
