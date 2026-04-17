import { ERROR_UNKNOWN } from '@/utils/errorMessages'

export type CancelSubscriptionError =
  | 'SUBSCRIPTION_NOT_FOUND'
  | 'DOES_NOT_BELONG_TO_USER'
  | 'ALREADY_CANCELLED'
  | 'UNKNOWN_ERROR'

export const CANCEL_SUBSCRIPTION_ERROR_MAP: Record<string, CancelSubscriptionError> = {
  SubscriptionNotFoundError: 'SUBSCRIPTION_NOT_FOUND',
  SubscriptionDoesNotBelongToUserError: 'DOES_NOT_BELONG_TO_USER',
  SubscriptionAlreadyCancelledError: 'ALREADY_CANCELLED',
  UnknownError: 'UNKNOWN_ERROR'
}

export const CANCEL_SUBSCRIPTION_ERROR_MESSAGES: Record<CancelSubscriptionError, string> = {
  SUBSCRIPTION_NOT_FOUND: 'Subscription not found.',
  DOES_NOT_BELONG_TO_USER: 'This subscription does not belong to your account.',
  ALREADY_CANCELLED: 'This subscription is already cancelled.',
  UNKNOWN_ERROR: ERROR_UNKNOWN
}
