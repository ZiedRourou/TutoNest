import { EnvironmentEnum } from '../enums/environnement-enum';

export type EnvironnementEnumValueType = (typeof EnvironmentEnum)[keyof typeof EnvironmentEnum];
