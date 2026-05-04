import { Injectable, Logger } from '@nestjs/common'
import { EmailMapper } from 'src/email/email.mapper'
import { EmailService } from 'src/email/email.service'
import { GroupsService } from 'src/groups/groups.service'
import { OrganizationTypeEnum } from 'src/logto/_utils/enums/organization-types.enum'
import { decodeUserCustomData } from 'src/logto/_utils/schemas/logto-user.schema'
import { LogtoRequests } from 'src/logto/logto.requests'
import { LogtoService } from 'src/logto/logto.service'
import { MilvusService } from 'src/milvus/milvus.service'
import { OrganizationsService } from 'src/organizations/organizations.service'
import { PayfactPlanNameEnum } from 'src/payments/_utils/enum/payfact-plan-name.enum'
import { PaymentsService } from 'src/payments/payments.service'
import { StoreService } from 'src/store/store.service'
import { SubscriptionsMapper } from 'src/subscriptions/subscriptions.mapper'
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service'
import { UsersService } from 'src/users/users.service'
import { DrivesService } from '../drives/drives.service'
import { RustfsService } from '../rustfs/rustfs.service'
import { PayfactWebhookEnum } from './_utils/enums/payfact-webhook.enum'
import { LogtoEmailWebhookDto } from './_utils/types/logto-email-webhook.types'
import {
  LogtoWebhookEvent,
  LogtoWebhookPayload,
  OrganizationMembershipUpdatedWebhookPayload,
  UserCreatedWebhookPayload,
} from './_utils/types/logto-webhook.types'
import { MeilisearchWebhook, MeilisearchWebhookTypes } from './_utils/types/meilisearch-webhook.type'
import { SubscriptionWebhookDto } from './_utils/types/payfact-webhook.type'

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name)
  private readonly jitUserSessionMap = new Map<string, string[]>()

  constructor(
    private readonly emailService: EmailService,
    private readonly emailMapper: EmailMapper,
    private readonly groupsService: GroupsService,
    private readonly drivesService: DrivesService,
    private readonly storeService: StoreService,
    private readonly paymentsService: PaymentsService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly rustfsService: RustfsService,
    private readonly milvusService: MilvusService,
    private readonly logtoService: LogtoService,
    private readonly LogtoRequests: LogtoRequests,
    private readonly usersService: UsersService,
    private readonly organizationsService: OrganizationsService,
    private readonly subscriptionsMapper: SubscriptionsMapper,
  ) {}

  async handleLogtoWebhookEvent(payload: LogtoWebhookPayload): Promise<void> {
    this.logger.log(`Received logto webhook event: ${payload.event}`)

    try {
      switch (payload.event) {
        case LogtoWebhookEvent.POST_REGISTER:
          break

        case LogtoWebhookEvent.USER_CREATED:
          this.handleUserCreatedWebhook(payload)
          break

        case LogtoWebhookEvent.USER_UPDATED:
          await this.groupsService.handleLogtoUserUpdate(payload)
          await this.drivesService.handleLogtoUserUpdate(payload)
          break

        case LogtoWebhookEvent.USER_DELETED:
          await this.groupsService.handleLogtoUserDeletion(payload.data.id)
          await this.drivesService.handleFolderPermissionsOnUserDeletion(payload.data.id)
          break

        case LogtoWebhookEvent.ORGANIZATION_CREATED:
          await this.drivesService.createDrive(payload.data.id, payload)
          await this.milvusService.createDatabase(payload.data.id)
          await this.rustfsService.createBucketIfNotExists(payload.data.id)
          await this.organizationsService.createLiteLLMTeamAndKey(payload.data.id)
          break

        case LogtoWebhookEvent.ORGANIZATION_UPDATED:
          break

        case LogtoWebhookEvent.ORGANIZATION_DELETED:
          await this.milvusService.deleteDatabase(payload.data.id)
          break

        case LogtoWebhookEvent.ORGANIZATION_MEMBERSHIP_UPDATED: {
          if (payload.interactionEvent === 'Register' && payload.sessionId) {
            const existingOrgs = this.jitUserSessionMap.get(payload.sessionId) || []

            existingOrgs.push(payload.organizationId)

            this.jitUserSessionMap.set(payload.sessionId, existingOrgs)
          }
          await this.handleOrganizationMembershipUpdatedWebhook(payload)
          break
        }

        default:
          this.logger.warn(`Unhandled webhook event: ${payload.event}`)
      }
    } catch (error) {
      this.logger.error(`Error processing webhook event: ${payload.event}`, error)
      throw error
    }
  }

  async handleLogtoEmailWebhook(dto: LogtoEmailWebhookDto): Promise<void> {
    const emailDto = this.emailMapper.mapLogtoEmailWebhookToEmailDto(dto)
    await this.emailService.sendLogtoEmail(emailDto)
  }

  async handleMeilisearchSynchroWebhook(tasks: MeilisearchWebhook[]) {
    for (const task of tasks) {
      if (task.status === 'succeeded' && task.indexUid.includes('oreus')) {
        if (task.type === MeilisearchWebhookTypes.UPSERT_DOCUMENT)
          this.storeService.updateSyncStatus({
            type: task.type,
            storeItemIds: undefined,
            isSynchronized: true,
          })
        if (task.type === MeilisearchWebhookTypes.REMOVE_DOCUMENT) this.storeService.deleteStoreItems()
        return
      }
    }
  }

  async handlePayfactWebhook(payload: SubscriptionWebhookDto) {
    this.logger.log(`Received payfact webhook event: ${payload.type}`)

    switch (payload.type) {
      case PayfactWebhookEnum.SUBSCRIPTIONS_CHANGED: {
        const bundles = await this.paymentsService.getCustomerSubscriptions(payload.content.customerId)

        const allActiveSubscriptions = bundles.flatMap((bundle) =>
          bundle.subscriptions.map((s) => this.subscriptionsMapper.toGetSubscriptionFromPayfactSubscriptionBundle(s)),
        )
        const oldSubscriptions = await this.subscriptionsService.getOrganizationIdByPayfactCustomerId(
          payload.content.customerId,
        )

        const subscription = await this.subscriptionsService.updateOrCreateIfNotExists({
          payfactCustomerId: payload.content.customerId,
          organizationId: oldSubscriptions?.organizationId,
          subscriptions: allActiveSubscriptions,
        })

        if (subscription.organizationId) {
          const [user, organization] = await Promise.all([
            this.logtoService.getUserInformations(subscription.logtoUserId),
            this.logtoService.getOrganizationInformations(subscription.organizationId),
          ])

          const customData = decodeUserCustomData(user.customData)

          const isPersonal = organization.customData.organizationType === OrganizationTypeEnum.PERSONAL
          const hasPlus = subscription.subscriptions.some(
            (s) =>
              s.planName === PayfactPlanNameEnum.PLUS_MONTHLY || s.planName === PayfactPlanNameEnum.BUSINESS_MONTHLY,
          )

          const personalOrg =
            hasPlus && !isPersonal
              ? await this.logtoService
                  .getUserOrganizations(subscription.logtoUserId)
                  .then((orgs) => orgs.find((org) => org.customData.organizationType === OrganizationTypeEnum.PERSONAL))
              : null

          const orgCustomDataUpdates = {
            ...(isPersonal &&
              hasPlus && {
                organizationType: OrganizationTypeEnum.PLUS,
              }),

            organizationStatus: {
              ...organization.customData.organizationStatus,
              isActive: true,
              createdAt: organization.customData.organizationStatus?.createdAt ?? Date.now(),
            },
          }

          const hasOrgUpdates = Object.keys(orgCustomDataUpdates).length > 0

          await Promise.all([
            !customData.didOnboard &&
              this.usersService.updateUserCustomData(user, {
                ...customData,
                didOnboard: true,
              }),
            hasOrgUpdates &&
              this.LogtoRequests.updateOrganization(organization.id, {
                customData: {
                  ...organization.customData,
                  ...orgCustomDataUpdates,
                },
              }),
            personalOrg &&
              personalOrg.customData.organizationType !== OrganizationTypeEnum.PLUS &&
              this.LogtoRequests.updateOrganization(personalOrg.id, {
                customData: {
                  ...personalOrg.customData,
                  organizationType: OrganizationTypeEnum.PLUS,
                },
              }),
          ])
        }
        break
      }
      default:
        break
    }
  }

  private async handleUserCreatedWebhook(payload: UserCreatedWebhookPayload) {
    const user = payload.data
    const sessionId = payload.sessionId

    const organizationIds = sessionId ? this.jitUserSessionMap.get(sessionId) : undefined
    let customData = decodeUserCustomData(user.customData)

    if (organizationIds && organizationIds.length > 0) {
      customData = { ...customData, didOnboard: true }

      await this.usersService.updateUserCustomData(user, {
        ...customData,
      })

      const promises = organizationIds.map(async (orgId) => {
        const orgDetail = await this.logtoService.getOrganizationInformations(orgId)
        const ownerDetail = await this.logtoService.getUserInformations(orgDetail.customData.ownerId)
        const calls = await Promise.allSettled([
          this.paymentsService.updateOrganizationLicenceSubscription(
            {
              email: user?.primaryEmail ?? '',
              organizationId: orgId,
              planName: PayfactPlanNameEnum.PRO_LICENSE_MONTHLY,
            },
            PayfactPlanNameEnum.PRO_LICENSE_MONTHLY,
          ),
          this.emailService.sendJitUserJoinedEmail({
            newUserEmail: user?.primaryEmail ?? '',
            email: ownerDetail?.primaryEmail ?? '',
            username: ownerDetail?.username ?? '',
          }),
        ])

        return {
          organizationId: orgId,
          license: calls[0],
          email: calls[1],
        }
      })

      await Promise.allSettled(promises)
    }

    if (sessionId) {
      this.jitUserSessionMap.delete(sessionId)
    }

    await this.logtoService.createPersonalOrganization(user)
    await this.usersService.handleUserCreation(user, customData)
  }

  private async handleOrganizationMembershipUpdatedWebhook(payload: OrganizationMembershipUpdatedWebhookPayload) {
    const organization = await this.logtoService.getOrganizationInformations(payload.organizationId)
    await this.organizationsService.refreshOrganizationMembersStats(organization)
  }
}
