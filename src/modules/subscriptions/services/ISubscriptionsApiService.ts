import type { CustomerSubscription } from '@/gql/graphql'
import type { ServiceResult } from '@/modules/shop/interfaces/service-result'
import type { CancelSubscriptionError } from '../interfaces/subscription-errors'

export interface ISubscriptionsApiService {
  getCurrentUserSubscriptions(): Promise<CustomerSubscription[]>
  cancelSubscription(subscriptionId: string): Promise<ServiceResult<true, CancelSubscriptionError>>
}
