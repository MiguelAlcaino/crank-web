import {
  CancelSubscriptionDocument,
  GetCurrentUserSubscriptionsDocument,
  type CustomerSubscription
} from '@/gql/graphql'
import type { ServiceResult } from '@/modules/shop/interfaces/service-result'
import { handleInfrastructureErrors } from '@/modules/shop/services/utils/handleInfrastructureErrors'
import type { ApolloClient } from '@apollo/client/core'
import {
  CANCEL_SUBSCRIPTION_ERROR_MAP,
  type CancelSubscriptionError
} from '../interfaces/subscription-errors'
import type { ISubscriptionsApiService } from './ISubscriptionsApiService'

export class SubscriptionsApiService implements ISubscriptionsApiService {
  constructor(private readonly authClient: ApolloClient<any>) {}

  async getCurrentUserSubscriptions(): Promise<CustomerSubscription[]> {
    const { data } = await this.authClient.query({
      query: GetCurrentUserSubscriptionsDocument,
      fetchPolicy: 'network-only'
    })
    return (data?.currentUser?.subscriptions ?? []) as CustomerSubscription[]
  }

  async cancelSubscription(
    subscriptionId: string
  ): Promise<ServiceResult<true, CancelSubscriptionError>> {
    try {
      const { data } = await this.authClient.mutate({
        mutation: CancelSubscriptionDocument,
        variables: { input: { subscriptionId } }
      })

      const result = data?.cancelSubscription
      if (result?.__typename === 'CancelSubscriptionSuccess') {
        return { ok: true, data: true }
      }

      const error: CancelSubscriptionError =
        CANCEL_SUBSCRIPTION_ERROR_MAP[result?.__typename ?? ''] ?? 'UNKNOWN_ERROR'
      return { ok: false, error }
    } catch (error) {
      return handleInfrastructureErrors<CancelSubscriptionError>(error)
    }
  }
}
