import { inject } from 'vue'
import type { ISubscriptionsApiService } from '../services/ISubscriptionsApiService'

export function useSubscriptionsApiService(): ISubscriptionsApiService {
  const service = inject<ISubscriptionsApiService>('subscriptionsApiService')
  if (!service) throw new Error('SubscriptionsApiService not provided')
  return service
}
