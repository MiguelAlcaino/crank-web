import type { IApiService } from '@/services/IApiService'
import { inject } from 'vue'

/**
 * It provides a centralized and secure way to obtain the ApiService.
 * Throws a descriptive error if the service is not available.
 */
export function useApiService(): IApiService {
  const apiService = inject<IApiService>('gqlApiService')

  if (!apiService) {
    throw new Error(
      'ApiService (gqlApiService) could not be injected.' +
        'Make sure it has been provided in main.ts or in an ancestor component.'
    )
  }

  return apiService
}
