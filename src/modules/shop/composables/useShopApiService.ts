import { inject } from 'vue'
import type { IShopApiService } from '../services/IShopApiService'

export function useShopApiService(): IShopApiService {
  const service = inject<IShopApiService>('shopApiService')
  if (!service) throw new Error('ShopApiService not provided')
  return service
}
