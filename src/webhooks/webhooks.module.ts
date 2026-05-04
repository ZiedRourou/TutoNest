import { Module } from '@nestjs/common'
import { EmailModule } from 'src/email/email.module'
import { GroupsModule } from 'src/groups/groups.module'
import { MilvusModule } from 'src/milvus/milvus.module'
import { OrganizationsModule } from 'src/organizations/organizations.module'
import { PaymentsModule } from 'src/payments/payments.module'
import { StoreModule } from 'src/store/store.module'
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module'
import { UsersModule } from 'src/users/users.module'
import { DrivesModule } from '../drives/drives.module'
import { PermissionsModule } from '../permissions/permissions.module'
import { RustfsModule } from '../rustfs/rustfs.module'
import { WebhooksController } from './webhooks.controller'
import { WebhooksService } from './webhooks.service'

@Module({
  imports: [
    UsersModule,
    GroupsModule,
    EmailModule,
    StoreModule,
    DrivesModule,
    PaymentsModule,
    SubscriptionsModule,
    RustfsModule,
    MilvusModule,
    OrganizationsModule,
    PermissionsModule,
  ],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
