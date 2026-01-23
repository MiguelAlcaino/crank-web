import type { ServiceResult } from '@/modules/shop/interfaces/service-result'

export function handleInfrastructureError<E>(error: any): ServiceResult<never, E> {
  console.error('Infrastructure Error:', error)

  let userMessage = 'An unexpected error occurred.'

  if (error.networkError) {
    userMessage = 'There is no connection to the server. Check your internet connection.'
  } else if (error.message && error.message.includes('fetch')) {
    userMessage = 'The server is currently unavailable.'
  }

  return {
    ok: false,
    error: 'UNKNOWN_ERROR' as unknown as E,
    message: userMessage
  }
}
