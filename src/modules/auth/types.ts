import type { User } from '@/gql/graphql'

/**
 * @description Represents a lightweight, essential subset of the User data.
 * Contains only the necessary information for global state management and UI display
 * (e.g., headers, menus), avoiding the overhead of the full User object.
 */
export type BasicUser = Pick<User, 'firstName' | 'lastName' | 'email' | 'isMobilePhoneVerified'>
