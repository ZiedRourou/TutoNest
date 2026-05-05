export enum ProductNameEnum {
  OREUS_STUDIO = 'Oreus Studio',
  OREUS_VOX = 'Oreus VOX',
}

export interface ContactEmailContext {
  productName: ProductNameEnum
  name: string
  email: string
  nameOrganization: string
  messageContent: string
  sentAt?: string
}
