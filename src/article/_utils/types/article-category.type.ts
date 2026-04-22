import { ArticleCategoryEnum } from '../enum/article-category.enum';

export type ArticleCategoryEnumValueType = (typeof ArticleCategoryEnum)[keyof typeof ArticleCategoryEnum];
