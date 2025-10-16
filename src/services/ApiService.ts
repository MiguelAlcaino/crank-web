import { gql } from '@apollo/client'
import {
  type AcceptLateCancelledSpotInClassInput,
  type AcceptLateCancelledSpotInClassResultUnion,
  AddItemToShoppingCartDocument,
  type AddItemToShoppingCartMutation,
  type AddItemToShoppingCartMutationVariables,
  type BookClassInput,
  CalculateTotalForShoppingCartDocument,
  type CalculateTotalForShoppingCartQuery,
  type CalculateTotalForShoppingCartQueryVariables,
  type CalendarClassesParams,
  type CancelEnrollmentInput,
  type Class,
  type ClassInfo,
  type ClassStat,
  type Country,
  type CreateCurrentUserInSiteUnion,
  type CurrentUserEnrollmentsParams,
  type EditClassInput,
  type EditClassResultUnion,
  type EditEnrollmentInput,
  type EditEnrollmentResultUnion,
  EmptyShoppingCartDocument,
  type EmptyShoppingCartMutation,
  type EmptyShoppingCartMutationVariables,
  type Enrollment,
  type EnrollmentInfo,
  EnrollmentTypeEnum,
  GenerateMerchantReferenceDocument,
  type GenerateMerchantReferenceMutation,
  type GenerateMerchantReferenceMutationVariables,
  GeneratePayfortFormDocument,
  type GeneratePayfortFormMutation,
  type GeneratePayfortFormMutationVariables,
  GetCartSummaryDocument,
  GetCurrentUserBasicInfoDocument,
  GetProductsDocument,
  type GetProductsQuery,
  type GetProductsQueryVariables,
  GetShoppingCartDocument,
  type GetShoppingCartQuery,
  type GetShoppingCartQueryVariables,
  type IsSmsValidationCodeValidUnion,
  type ItemToShoppingCartInput,
  LockShoppingCartDocument,
  type LockShoppingCartMutation,
  type LockShoppingCartMutationVariables,
  type PaginatedClassStats,
  type PaginatedEnrollments,
  type PaginatedPurchases,
  type PaginationInput,
  type PayfortFormInput,
  PaymentTransactionStatusDocument,
  PaymentTransactionStatusEnum,
  type PaymentTransactionStatusInput,
  type PaymentTransactionStatusQuery,
  type PaymentTransactionStatusQueryVariables,
  type ProductType,
  type RegisterUserInput,
  type RejectLateBookingResultUnion,
  type RejectLateCancelledSpotInClassInput,
  type RemoveCurrentUserFromWaitlistInput,
  RemoveDiscountCodeDocument,
  type RemoveDiscountCodeMutation,
  type RemoveDiscountCodeMutationVariables,
  RemoveItemFromShoppingCartDocument,
  type RemoveItemFromShoppingCartMutation,
  type RemoveItemFromShoppingCartMutationVariables,
  type RemoveUserFromWaitlistInput,
  type RemoveUserFromWaitlistUnion,
  type RequestPasswordLinkInput,
  type ResetPasswordForCurrentUserInput,
  type ResetPasswordForCurrentUserUnion,
  type ResetPasswordLinkResultUnion,
  type ShoppingCart as GqlShoppingCart,
  type SimpleSiteUser,
  type Site,
  type SiteSetting,
  type SmsValidationUnion,
  type UpdateCurrentUserPasswordInput,
  UpdateItemInShoppingCartDocument,
  type UpdateItemInShoppingCartMutation,
  type UpdateItemInShoppingCartMutationVariables,
  type User,
  type UserInClassRanking,
  type UserInput,
  type UserInRankingParams,
  type AddDiscountCodeToShoppingCartMutation,
  type AddDiscountCodeToShoppingCartMutationVariables,
  AddDiscountCodeToShoppingCartDocument
} from '@/gql/graphql'
import { ApolloClient, ApolloError } from '@apollo/client/core'
import { CustomCalendarClasses } from '@/model/CustomCalendarClasses'
import { SmsValidationResponse } from '@/modules/buy_packages/models/sms-validation-response'
import { IsSmsValidationCodeValidResponse } from '@/modules/buy_packages/models/is-sms-validation-code-valid-response'
import type { IApiService } from './IApiService'
import type { Product, ProductFromQuery } from '@/modules/shop/models/Product'
import { createProductModel } from '@/modules/shop/factories/productFactory'
import type { AppProductType } from '@/modules/shop/models/types'
import type { SiteEnum } from '@/modules/shared/interfaces/site.enum'
import type { ShoppingCart as ShoppingCartModel } from '@/modules/shop/models/ShoppingCart'
import { createShoppingCartModel } from '@/modules/shop/factories/shoppingCartFactory'
import type { BasicUser } from '@/modules/auth/types'
import type { CartSummary } from '@/modules/shop/interfaces/cart-summary'

// A custom error class to handle API errors more cleanly.
export class ApiError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiService implements IApiService {
  /**
   * Apollo client for making authenticated requests.
   */
  authApiClient: ApolloClient<any>

  /**
   * Apollo client for making anonymous requests.
   */
  anonymousApiClient: ApolloClient<any>

  constructor(authApiClient: ApolloClient<any>, anonymousApiClient: ApolloClient<any>) {
    this.authApiClient = authApiClient
    this.anonymousApiClient = anonymousApiClient
  }

  async getSiteSettings(site: SiteEnum): Promise<SiteSetting | null> {
    const SITE_SETTING_QUERY = gql`
      query siteSettings($site: SiteEnum!) {
        siteSettings(site: $site) {
          siteDateTimeNow
          siteTimezone
        }
      }
    `
    try {
      const queryResult = await this.authApiClient.query({
        query: SITE_SETTING_QUERY,
        variables: {
          site: site
        },
        fetchPolicy: 'network-only'
      })

      return queryResult.data.siteSettings as SiteSetting
    } catch (error) {
      return null
    }
  }

  async getMyself(): Promise<User | null> {
    const CURRENT_USER_QUERY = gql`
      query currentUser {
        currentUser {
          email
          firstName
          lastName
          gender
          birthdate
          country {
            name
            code
            states {
              name
              code
            }
          }
          state {
            name
            code
          }
          city
          address1
          address2
          zipCode
          phone
          emergencyContactName
          emergencyContactPhone
          emergencyContactRelationship
          hideMetrics
          weight
          leaderboardUsername
        }
      }
    `
    try {
      const queryResult = await this.authApiClient.query({
        query: CURRENT_USER_QUERY
      })

      return queryResult.data.currentUser as User
    } catch (error) {
      return null
    }
  }

  async currentUserSingleWorkoutStat(enrollmentId: string): Promise<ClassStat> {
    const query = gql`
      query currentUserSingleWorkoutStat($enrollmentId: ID!) {
        currentUserSingleWorkoutStat(enrollmentId: $enrollmentId) {
          enrollment {
            enrollmentInfo {
              id
              ... on EnrollmentInfo {
                spotNumber
              }
            }
            class {
              id
              name
              start
              duration
              instructorName
            }
          }
          averagePower
          highPower
          averageRpm
          highRpm
          totalEnergy
          calories
          distance
          adjustedChartPoints(amountOfPoints: 62) {
            time
            rpm
            power
          }
        }
      }
    `

    const queryResult = await this.authApiClient.query({
      query: query,
      variables: {
        enrollmentId: enrollmentId
      }
    })

    return queryResult.data.currentUserSingleWorkoutStat as ClassStat
  }

  async getCurrentUserEnrollmentInClass(classId: string): Promise<EnrollmentInfo | null> {
    const CURRENT_USER_ENROLLMENT_IN_CLASS_QUERY = gql`
      query currentUserEnrollmentInClass($classId: ID!) {
        currentUser {
          enrollmentInClass(classId: $classId) {
            id
            enrollmentStatus
            enrollmentDateTime
            ... on EnrollmentInfo {
              spotNumber
            }
          }
        }
      }
    `
    try {
      const queryResult = await this.authApiClient.query({
        query: CURRENT_USER_ENROLLMENT_IN_CLASS_QUERY,
        variables: { classId: classId },
        fetchPolicy: 'no-cache'
      })

      if (queryResult.data.currentUser.enrollmentInClass) {
        return queryResult.data.currentUser.enrollmentInClass as EnrollmentInfo
      }

      return null
    } catch (error) {
      return null
    }
  }

  async getCountries(): Promise<Country[]> {
    const COUNTRIES_QUERY = gql`
      query Countries {
        countries {
          name
          code
        }
      }
    `
    try {
      const queryResult = await this.anonymousApiClient.query({
        query: COUNTRIES_QUERY
      })

      return queryResult.data.countries as Country[]
    } catch (error) {
      return []
    }
  }

  async getCountry(countryCode: string): Promise<Country | null> {
    const COUNTRY_QUERY = gql`
      query country($countryCode: String!) {
        country(countryCode: $countryCode) {
          name
          code
          states {
            name
            code
          }
        }
      }
    `
    try {
      const queryResult = await this.anonymousApiClient.query({
        query: COUNTRY_QUERY,
        variables: {
          countryCode: countryCode
        }
      })

      return queryResult.data.country as Country
    } catch (error) {
      return null
    }
  }

  async getCalendarClasses(site: SiteEnum, startDate: string, endDate: string): Promise<Class[]> {
    const CALENDAR_CLASSES_QUERY = gql`
      query calendarClasses($site: SiteEnum!, $params: CalendarClassesParams) {
        calendarClasses(site: $site, params: $params) {
          id
          name
          description
          instructorName
          isSubstitute
          start
          startWithNoTimeZone
          duration
          waitListAvailable
          bookingWindow {
            startDateTime
            endDateTime
          }
          showAsDisabled
        }
      }
    `

    const params: CalendarClassesParams = {
      startDate: startDate,
      endDate: endDate
    }

    const queryResult = await this.anonymousApiClient.query({
      query: CALENDAR_CLASSES_QUERY,
      variables: {
        site: site,
        params: params
      }
    })

    return queryResult.data.calendarClasses as Class[]
  }

  async getCustomCalendarClasses(
    site: SiteEnum,
    startDate: string,
    endDate: string
  ): Promise<CustomCalendarClasses> {
    const CUSTOM_CALENDAR_CLASSES_QUERY = gql`
      query customCalendarClasses(
        $site: SiteEnum!
        $params: CalendarClassesParams
        $enrollmentsWaitlistParams: CurrentUserEnrollmentsParams
        $enrollmentsUpcomingParams: CurrentUserEnrollmentsParams
      ) {
        siteSettings(site: $site) {
          siteDateTimeNow
          siteTimezone
        }
        calendarClasses(site: $site, params: $params) {
          id
          name
          description
          instructorName
          start
          startWithNoTimeZone
          duration
          waitListAvailable
          isSubstitute
          bookingWindow {
            startDateTime
            endDateTime
          }
          showAsDisabled
        }
        enrollmentsWaitlist: currentUserEnrollments(
          site: $site
          params: $enrollmentsWaitlistParams
        ) {
          enrollmentInfo {
            id
            enrollmentStatus
            enrollmentDateTime
          }
          class {
            id
            name
            description
            instructorName
            isSubstitute
            start
            startWithNoTimeZone
            duration
            waitListAvailable
          }
        }
        enrollmentsUpcoming: currentUserEnrollments(
          site: $site
          params: $enrollmentsUpcomingParams
        ) {
          enrollmentInfo {
            id
            enrollmentStatus
            enrollmentDateTime
          }
          class {
            id
            name
            description
            instructorName
            isSubstitute
            start
            startWithNoTimeZone
            duration
            waitListAvailable
          }
        }
      }
    `

    const params: CalendarClassesParams = {
      startDate: startDate,
      endDate: endDate
    }

    const enrollmentsWaitlistParams: CurrentUserEnrollmentsParams = {
      enrollmentType: EnrollmentTypeEnum.Waitlist,
      startDate: startDate,
      endDate: endDate
    }

    const enrollmentsUpcomingParams: CurrentUserEnrollmentsParams = {
      enrollmentType: EnrollmentTypeEnum.Upcoming,
      startDate: startDate,
      endDate: endDate
    }

    const queryResult = await this.authApiClient.query({
      query: CUSTOM_CALENDAR_CLASSES_QUERY,
      fetchPolicy: 'network-only',
      variables: {
        site: site,
        params: params,
        enrollmentsWaitlistParams: enrollmentsWaitlistParams,
        enrollmentsUpcomingParams: enrollmentsUpcomingParams
      }
    })

    const siteSettings = queryResult.data.siteSettings as SiteSetting
    const calendarClasses = queryResult.data.calendarClasses as Class[]
    const enrollmentsWaitlist = queryResult.data.enrollmentsWaitlist as Enrollment[]
    const enrollmentsUpcoming = queryResult.data.enrollmentsUpcoming as Enrollment[]

    return new CustomCalendarClasses(
      siteSettings,
      calendarClasses,
      enrollmentsWaitlist,
      enrollmentsUpcoming
    )
  }

  async getClassInfo(site: SiteEnum, id: string): Promise<ClassInfo | null> {
    const CLASS_INFO_QUERY = gql`
      query classInfo($site: SiteEnum!, $id: ID!) {
        classInfo(site: $site, id: $id) {
          class {
            id
            name
            description
            instructorName
            start
            startWithNoTimeZone
            duration
            waitListAvailable
          }
          usedSpots
          roomLayout {
            id
            name
            matrix {
              __typename
              x
              y
              icon
              ... on BookableSpot {
                spotNumber
              }
            }
          }
        }
      }
    `
    try {
      const queryResult = await this.authApiClient.query({
        query: CLASS_INFO_QUERY,
        variables: {
          site: site,
          id: id
        },
        fetchPolicy: 'network-only'
      })

      return queryResult.data.classInfo as ClassInfo
    } catch (error) {
      return null
    }
  }

  async registerUser(site: SiteEnum, input: RegisterUserInput): Promise<string> {
    const REGISTER_USER_MUTATION = gql`
      mutation registerUser($site: SiteEnum!, $input: RegisterUserInput!) {
        registerUser(site: $site, input: $input) {
          email
        }
      }
    `

    try {
      await this.anonymousApiClient.mutate({
        mutation: REGISTER_USER_MUTATION,
        variables: {
          site: site,
          input: input
        }
      })
      return 'SuccessRegistration'
    } catch (error) {
      if (error instanceof ApolloError) {
        if (error.graphQLErrors[0].message === 'register.user_already_registered') {
          return 'RegisterUserAlreadyRegisteredException'
        } else if (error.graphQLErrors[0].message === 'minimum_password_length_is_four_chars') {
          return 'MinimumPasswordLengthException'
        } else if (error.graphQLErrors[0].message === 'password_must_contain_letter_or_number') {
          return 'PasswordMustContainLetterOrNumberException'
        } else {
          return 'UnknownError'
        }
      } else {
        return 'UnknownError'
      }
    }
  }

  async updateCurrentUser(input: UserInput): Promise<string> {
    const UPDATE_CURRENT_USER_MUTATION = gql`
      mutation updateCurrentUser($input: UserInput!) {
        updateCurrentUser(input: $input) {
          email
        }
      }
    `

    try {
      await this.authApiClient.mutate({
        mutation: UPDATE_CURRENT_USER_MUTATION,
        variables: {
          input: input
        }
      })
      return 'UpdateProfileSuccess'
    } catch (error) {
      return 'UnknownError'
    }
  }

  async bookClass(site: SiteEnum, input: BookClassInput): Promise<string> {
    const BOOK_CLASS_MUTATION = gql`
      mutation bookClass($site: SiteEnum!, $input: BookClassInput!) {
        bookClass(site: $site, input: $input) {
          __typename
        }
      }
    `

    try {
      const result = await this.authApiClient.mutate({
        mutation: BOOK_CLASS_MUTATION,
        variables: {
          site: site,
          input: input
        }
      })

      return result.data.bookClass.__typename
    } catch (error) {
      return 'UnknownError'
    }
  }

  async cancelCurrentUserEnrollment(site: SiteEnum, input: CancelEnrollmentInput): Promise<string> {
    const CANCEL_CURRENT_USER_ENROLLMENT_MUTATION = gql`
      mutation cancelCurrentUserEnrollment($site: SiteEnum!, $input: CancelEnrollmentInput!) {
        cancelCurrentUserEnrollment(site: $site, input: $input) {
          __typename
        }
      }
    `

    try {
      const result = await this.authApiClient.mutate({
        mutation: CANCEL_CURRENT_USER_ENROLLMENT_MUTATION,
        variables: {
          site: site,
          input: input
        },
        fetchPolicy: 'network-only'
      })

      return result.data.cancelCurrentUserEnrollment.__typename
    } catch (error) {
      return 'UnknownError'
    }
  }

  async removeCurrentUserFromWaitlist(
    site: SiteEnum,
    input: RemoveCurrentUserFromWaitlistInput
  ): Promise<any> {
    const REMOVE_CURRENT_USER_FROM_WAITLIST_MUTATION = gql`
      mutation removeCurrentUserFromWaitlist(
        $site: SiteEnum!
        $input: RemoveCurrentUserFromWaitlistInput!
      ) {
        removeCurrentUserFromWaitlist(site: $site, input: $input) {
          ... on RemoveFromWaitlistResult {
            success
          }
          ... on WaitlistEntryNotFoundError {
            code
          }
        }
      }
    `

    try {
      const result = await this.authApiClient.mutate({
        mutation: REMOVE_CURRENT_USER_FROM_WAITLIST_MUTATION,
        variables: {
          site: site,
          input: input
        },
        fetchPolicy: 'network-only'
      })

      return result.data.removeCurrentUserFromWaitlist
    } catch (error) {
      return { __typename: 'UnknownError' }
    }
  }

  async removeUserFromClass(enrollmentId: string, lateCancel?: boolean): Promise<string> {
    const input = { enrollmentId: enrollmentId, lateCancel: lateCancel } as CancelEnrollmentInput

    const REMOVE_USER_FROM_CLASS_MUTATION = gql`
      mutation removeUserFromClass($input: CancelEnrollmentInput!) {
        removeUserFromClass(input: $input) {
          __typename
        }
      }
    `

    try {
      const result = await this.authApiClient.mutate({
        mutation: REMOVE_USER_FROM_CLASS_MUTATION,
        variables: {
          input: input
        },
        fetchPolicy: 'network-only'
      })

      return result.data.removeUserFromClass.__typename
    } catch (error) {
      return 'UnknownError'
    }
  }

  async editClass(input: EditClassInput): Promise<EditClassResultUnion> {
    const EDIT_CLASS_MUTATION = gql`
      mutation editClass($input: EditClassInput!) {
        editClass(input: $input) {
          __typename
          ... on EditClassSuccessResult {
            __typename
            updated
          }
        }
      }
    `

    const result = await this.authApiClient.mutate({
      mutation: EDIT_CLASS_MUTATION,
      variables: {
        input: input
      },
      fetchPolicy: 'network-only'
    })

    return result.data.editClass as EditClassResultUnion
  }

  async updateCurrentUserPassword(
    site: SiteEnum,
    input: UpdateCurrentUserPasswordInput
  ): Promise<string> {
    const UPDATE_CURRENT_USER_PASSWORD_MUTATION = gql`
      mutation updateCurrentUserPassword(
        $site: SiteEnum!
        $input: UpdateCurrentUserPasswordInput!
      ) {
        updateCurrentUserPassword(site: $site, input: $input)
      }
    `

    try {
      await this.authApiClient.mutate({
        mutation: UPDATE_CURRENT_USER_PASSWORD_MUTATION,
        variables: {
          site: site,
          input: input
        },
        fetchPolicy: 'network-only'
      })

      return 'Success'
    } catch (error) {
      if (error instanceof ApolloError) {
        if (error.graphQLErrors[0].message === 'password_must_contain_letter_or_number') {
          return 'PasswordMustContainLetterOrNumberException'
        } else if (error.graphQLErrors[0].message === 'minimum_password_length_is_four_chars') {
          return 'MinimumPasswordLengthException'
        } else if (error.graphQLErrors[0].message === 'incorrect_password') {
          return 'IncorrectPasswordException'
        } else {
          return 'UnknownError'
        }
      }
      return 'UnknownError'
    }
  }

  async editCurrentUserEnrollment(
    site: SiteEnum,
    enrollmentId: string,
    newSpotNumber: number
  ): Promise<string> {
    const input = {
      enrollmentId: enrollmentId,
      newSpotNumber: newSpotNumber
    } as EditEnrollmentInput

    const mutation = gql`
      mutation editCurrentUserEnrollment($site: SiteEnum!, $input: EditEnrollmentInput!) {
        editCurrentUserEnrollment(site: $site, input: $input) {
          __typename
          ... on SpotAlreadyReservedError {
            code
          }
          ... on TryToSwitchToSameSpotError {
            code
          }
          ... on ClientIsOutsideSchedulingWindowError {
            code
          }
        }
      }
    `

    try {
      const result = await this.authApiClient.mutate({
        mutation: mutation,
        variables: {
          site: site,
          input: input
        },
        fetchPolicy: 'network-only'
      })

      return result.data.editCurrentUserEnrollment.__typename
    } catch (error) {
      return 'UnknownError'
    }
  }

  async requestPasswordLink(email: string): Promise<ResetPasswordLinkResultUnion | null> {
    const input = { email: email } as RequestPasswordLinkInput

    const mutation = gql`
      mutation requestPasswordLink($input: RequestPasswordLinkInput) {
        requestPasswordLink(input: $input) {
          ... on TooManyResetPasswordLinkRequestsError {
            availableAgainAt
          }
          ... on ResetPasswordLinkSentSuccessfully {
            status
          }
        }
      }
    `

    try {
      const result = await this.authApiClient.mutate({
        mutation: mutation,
        variables: {
          input: input
        },
        fetchPolicy: 'network-only'
      })

      return result.data.requestPasswordLink as ResetPasswordLinkResultUnion
    } catch (error) {
      return null
    }
  }

  async resetPasswordForCurrentUser(
    password: string,
    repeatedPassword: string
  ): Promise<ResetPasswordForCurrentUserUnion | null> {
    const input = {
      password: password,
      repeatedPassword: repeatedPassword
    } as ResetPasswordForCurrentUserInput

    const mutation = gql`
      mutation resetPasswordForCurrentUser($input: ResetPasswordForCurrentUserInput) {
        resetPasswordForCurrentUser(input: $input) {
          __typename
          ... on PasswordsDontMatchError {
            __typename
            code
          }
          ... on ResetPasswordSuccess {
            __typename
            status
          }
        }
      }
    `

    try {
      const result = await this.authApiClient.mutate({
        mutation: mutation,
        variables: {
          input: input
        },
        fetchPolicy: 'network-only'
      })

      return result.data.resetPasswordForCurrentUser as ResetPasswordForCurrentUserUnion
    } catch (error) {
      return null
    }
  }

  async currentUserDoesExistInSite(site: string): Promise<boolean> {
    const query = gql`
      query currentUserDoesExistInSite($site: SiteEnum!) {
        currentUser {
          doesExistInSite(site: $site)
        }
      }
    `
    try {
      const queryResult = await this.authApiClient.query({
        query: query,
        variables: {
          site: site
        },
        fetchPolicy: 'network-only'
      })

      return queryResult.data.currentUser.doesExistInSite as boolean
    } catch (error) {
      return false
    }
  }

  async createCurrentUserInSite(
    fromSite: string,
    toSite: string
  ): Promise<CreateCurrentUserInSiteUnion | null> {
    const mutation = gql`
      mutation createCurrentUserInSite($fromSite: SiteEnum!, $toSite: SiteEnum!) {
        createCurrentUserInSite(fromSite: $fromSite, toSite: $toSite) {
          ... on CreateCurrentUserInSiteSuccess {
            __typename
            result
          }
          ... on UserAlreadyExistsError {
            __typename
            code
          }
        }
      }
    `

    try {
      const result = await this.authApiClient.mutate({
        mutation: mutation,
        variables: {
          fromSite: fromSite,
          toSite: toSite
        },
        fetchPolicy: 'network-only'
      })

      return result.data.createCurrentUserInSite as CreateCurrentUserInSiteUnion
    } catch (error) {
      return null
    }
  }

  async removeUserFromWaitlist(waitlistEntryId: string): Promise<RemoveUserFromWaitlistUnion> {
    const input = { waitlistEntryId: waitlistEntryId } as RemoveUserFromWaitlistInput

    const mutation = gql`
      mutation removeUserFromWaitlist($input: RemoveUserFromWaitlistInput!) {
        removeUserFromWaitlist(input: $input) {
          ... on RemoveFromWaitlistResult {
            success
          }
          ... on WaitlistEntryNotFoundError {
            code
          }
        }
      }
    `

    const result = await this.authApiClient.mutate({
      mutation: mutation,
      variables: {
        input: input
      },
      fetchPolicy: 'no-cache'
    })

    return result.data.removeUserFromWaitlist as RemoveUserFromWaitlistUnion
  }

  async editEnrollment(
    site: SiteEnum,
    input: EditEnrollmentInput
  ): Promise<EditEnrollmentResultUnion> {
    const mutation = gql`
      mutation editEnrollment($site: SiteEnum!, $input: EditEnrollmentInput!) {
        editEnrollment(site: $site, input: $input) {
          __typename
          ... on Enrollment {
            __typename
          }
          ... on SpotAlreadyReservedError {
            code
          }
          ... on TryToSwitchToSameSpotError {
            code
          }
          ... on ClientIsOutsideSchedulingWindowError {
            code
          }
        }
      }
    `
    const result = await this.authApiClient.mutate({
      mutation: mutation,
      variables: {
        site: site,
        input: input
      },
      fetchPolicy: 'no-cache'
    })

    return result.data.editEnrollment as EditEnrollmentResultUnion
  }

  async getCurrentUserSites(): Promise<SiteEnum[]> {
    const query = gql`
      query currentUserSites {
        currentUser {
          siteUsers {
            site
          }
        }
      }
    `

    const queryResult = await this.authApiClient.query({
      query: query,
      fetchPolicy: 'no-cache'
    })

    const currentUser = queryResult.data.currentUser as User

    const sites: SiteEnum[] = []
    currentUser.siteUsers.forEach((siteUser: SimpleSiteUser) => {
      sites.push(siteUser.site)
    })

    return sites
  }

  async getCurrentUserRankingInClass(
    site: SiteEnum,
    params: UserInRankingParams
  ): Promise<UserInClassRanking> {
    const query = gql`
      query currentUserRankingInClass($site: SiteEnum!, $params: UserInRankingParams) {
        currentUserRankingInClass(site: $site, params: $params) {
          totalRanking {
            positionInRanking
            totalMembersInRanking
          }
          genderRanking {
            gender
            ranking {
              positionInRanking
              totalMembersInRanking
            }
          }
        }
      }
    `

    const queryResult = await this.authApiClient.query({
      query: query,
      variables: {
        site: site,
        params: params,
        query: query
      },
      fetchPolicy: 'no-cache'
    })

    return queryResult.data.currentUserRankingInClass as UserInClassRanking
  }

  async acceptLateCancelledSpotInClass(
    site: SiteEnum,
    waitlistEntryId: string
  ): Promise<AcceptLateCancelledSpotInClassResultUnion> {
    const input = { waitlistEntryId: waitlistEntryId } as AcceptLateCancelledSpotInClassInput

    const mutation = gql`
      mutation acceptLateCancelledSpotInClass(
        $site: SiteEnum!
        $input: AcceptLateCancelledSpotInClassInput!
      ) {
        acceptLateCancelledSpotInClass(site: $site, input: $input) {
          __typename
          ... on AcceptLateCancelledSpotInClassSuccess {
            success
          }
        }
      }
    `

    const result = await this.authApiClient.mutate({
      mutation: mutation,
      variables: {
        site: site,
        input: input
      },
      fetchPolicy: 'network-only'
    })

    return result.data.acceptLateCancelledSpotInClass as AcceptLateCancelledSpotInClassResultUnion
  }

  async rejectLateCancelledSpotInClass(
    site: SiteEnum,
    waitlistEntryId: string
  ): Promise<RejectLateBookingResultUnion> {
    const input = { waitlistEntryId: waitlistEntryId } as RejectLateCancelledSpotInClassInput

    const mutation = gql`
      mutation rejectLateCancelledSpotInClass(
        $site: SiteEnum!
        $input: RejectLateCancelledSpotInClassInput!
      ) {
        rejectLateCancelledSpotInClass(site: $site, input: $input) {
          __typename
          ... on Error {
            code
          }
          ... on PositionAlreadyTakenError {
            code
          }
          ... on RejectLateCancelledSpotInClassSuccess {
            success
          }
        }
      }
    `

    const result = await this.authApiClient.mutate({
      mutation: mutation,
      variables: {
        site: site,
        input: input
      },
      fetchPolicy: 'network-only'
    })

    return result.data.rejectLateCancelledSpotInClass as RejectLateBookingResultUnion
  }

  async currentUserEnrollmentsPaginated(
    site: SiteEnum,
    params: CurrentUserEnrollmentsParams,
    pagination: PaginationInput
  ): Promise<PaginatedEnrollments> {
    const query = gql`
      query currentUserEnrollmentsPaginated(
        $site: SiteEnum!
        $params: CurrentUserEnrollmentsParams
        $pagination: PaginationInput
      ) {
        currentUserEnrollmentsPaginated(site: $site, params: $params, pagination: $pagination) {
          enrollments {
            enrollmentInfo {
              id
              enrollmentStatus
              enrollmentDateTime
              enrollmentDateTimeWithNoTimeZone
              ... on EnrollmentInfo {
                spotNumber
              }
              ... on WaitlistEntry {
                canBeTurnedIntoEnrollment
              }
            }
            class {
              id
              name
              description
              instructorName
              start
              startWithNoTimeZone
              duration
              waitListAvailable
              showAsDisabled
            }
          }
          total
        }
      }
    `

    const queryResult = await this.authApiClient.query({
      query: query,
      variables: {
        site: site,
        params: params,
        pagination: pagination
      },
      fetchPolicy: 'network-only'
    })

    return queryResult.data.currentUserEnrollmentsPaginated as PaginatedEnrollments
  }

  async currentUserWorkoutStatsPaginated(
    site: SiteEnum,
    pagination: PaginationInput
  ): Promise<PaginatedClassStats> {
    const query = gql`
      query currentUserWorkoutStatsPaginated($site: SiteEnum!, $pagination: PaginationInput) {
        currentUserWorkoutStatsPaginated(site: $site, pagination: $pagination) {
          classStats {
            enrollment {
              enrollmentInfo {
                id
                ... on EnrollmentInfo {
                  spotNumber
                }
              }
              class {
                name
                start
                duration
              }
            }
            totalEnergy
          }
          total
        }
      }
    `

    const queryResult = await this.authApiClient.query({
      query: query,
      variables: {
        site: site,
        pagination: pagination
      },
      fetchPolicy: 'network-only'
    })

    return queryResult.data.currentUserWorkoutStatsPaginated as PaginatedClassStats
  }

  async currentUserPurchasesPaginated(
    site: SiteEnum,
    pagination: PaginationInput
  ): Promise<PaginatedPurchases> {
    const query = gql`
      query currentUserPurchasesPaginated($site: SiteEnum!, $pagination: PaginationInput) {
        currentUserPurchasesPaginated(site: $site, pagination: $pagination) {
          purchases {
            packageName
            allowanceObtained
            allowanceRemaining
            paymentDateTime
            activationDateTime
            expirationDateTime
            current
          }
          total
        }
      }
    `

    const queryResult = await this.authApiClient.query({
      query: query,
      variables: {
        site: site,
        pagination: pagination
      }
    })

    return queryResult.data.currentUserPurchasesPaginated as PaginatedPurchases
  }

  async currentUserPhoneNumber(): Promise<string> {
    try {
      const query = gql`
        query currentUserPhoneNumber {
          currentUser {
            phone
          }
        }
      `

      const queryResult = await this.authApiClient.query({
        query: query,
        fetchPolicy: 'no-cache'
      })

      const user = queryResult.data.currentUser as User
      return user.phone
    } catch (error) {
      return ''
    }
  }

  async requestSMSValidation(
    countryCode: string,
    mobilePhone: string
  ): Promise<SmsValidationResponse> {
    const mutation = gql`
      mutation requestSMSValidation($input: RequestSMSValidationInput!) {
        requestSMSValidation(input: $input) {
          ... on MobilePhoneAlreadyVerifiedError {
            code
          }
          ... on SuccessfulRequestSMSValidation {
            success
          }
          ... on MobilePhoneNotValidError {
            code
          }
        }
      }
    `

    try {
      const result = await this.authApiClient.mutate({
        mutation: mutation,
        variables: {
          input: {
            countryCode: countryCode,
            mobilePhone: mobilePhone
          }
        },
        fetchPolicy: 'network-only'
      })

      const smsValidation = result.data.requestSMSValidation as SmsValidationUnion

      return new SmsValidationResponse(smsValidation.__typename ?? 'UnknownError')
    } catch (error) {
      return new SmsValidationResponse('UnknownError')
    }
  }

  async isSMSValidationCodeValid(smsCode: string): Promise<IsSmsValidationCodeValidResponse> {
    try {
      const query = gql`
        query isSMSValidationCodeValid($smsCode: String!) {
          isSMSValidationCodeValid(smsCode: $smsCode) {
            ... on SMSCodeValidatedSuccessfully {
              success
            }
            ... on RequestSMSValidationNeededError {
              code
            }
            ... on SMSValidationCodeError {
              code
            }
            ... on MobilePhoneAlreadyVerifiedError {
              code
            }
          }
        }
      `

      const queryResult = await this.authApiClient.query({
        query: query,
        fetchPolicy: 'no-cache',
        variables: {
          smsCode: smsCode
        }
      })

      const response = queryResult.data.isSMSValidationCodeValid as IsSmsValidationCodeValidUnion
      return new IsSmsValidationCodeValidResponse(response.__typename ?? 'UnknownError')
    } catch (error) {
      return new IsSmsValidationCodeValidResponse('UnknownError')
    }
  }

  async availableSites(): Promise<Site[]> {
    try {
      const query = gql`
        query availableSites {
          availableSites {
            name
            code
          }
        }
      `

      const queryResult = await this.authApiClient.query({
        query: query,
        fetchPolicy: 'no-cache'
      })

      return queryResult.data.availableSites as Site[]
    } catch (error) {
      return []
    }
  }

  async getProducts(site: SiteEnum, options?: { type?: AppProductType }): Promise<Product[]> {
    // Create the variables object for the query in a type-safe way.
    const variables: GetProductsQueryVariables = { site }
    if (options?.type) {
      // The `input` variable itself is optional in the GraphQL query.
      // We only add it to the variables object if the type is specified.
      variables.input = { type: options.type as unknown as ProductType }
    }

    try {
      const { data, errors } = await this.authApiClient.query<
        GetProductsQuery,
        GetProductsQueryVariables
      >({
        // Use the strongly-typed DocumentNode from our generated file.
        query: GetProductsDocument,
        variables,
        fetchPolicy: 'network-only'
      })

      // It's best practice to check for the `errors` array returned by GraphQL.
      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error fetching products: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      // If the API returns null or an empty array for products, we simply return an empty array.
      // This is expected behavior, not an error.
      if (!data || !data.products) {
        return []
      }

      // Map the raw DTOs from the API to our rich domain models using the factory.
      return data.products.map((productData) => createProductModel(productData as ProductFromQuery))
    } catch (error) {
      // Any exception (our ApiError, a network error, etc.) is caught here.
      // We log it and then re-throw it. This allows the calling code (e.g., a composable)
      // to catch the error and update the UI state (e.g., show an error message).
      console.error('ApiService: Failed to fetch products.', error)
      throw error
    }
  }

  async addItemToShoppingCart(
    site: SiteEnum,
    sellableProductId: string,
    quantity: number
  ): Promise<ShoppingCartModel> {
    const input: ItemToShoppingCartInput = { sellableProductId, quantity }

    try {
      const { data, errors } = await this.authApiClient.mutate<
        AddItemToShoppingCartMutation,
        AddItemToShoppingCartMutationVariables
      >({
        mutation: AddItemToShoppingCartDocument,
        variables: {
          site: site,
          input: input
        },
        fetchPolicy: 'network-only'
      })

      if (errors) {
        throw new Error(`GraphQL error: ${errors.map((e) => e.message).join(', ')}`)
      }

      const result = data?.addItemToShoppingCart

      if (!result) {
        throw new Error('Did not receive a valid response from the server.')
      }

      if (result.__typename === 'ShoppingCart') {
        // Success: The `result` object is fully typed thanks to the fragment.
        // We can now safely pass it to our model factory.
        return createShoppingCartModel(result as unknown as GqlShoppingCart)
      } else {
        // Business logic error (e.g., ProductNotFound)
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        throw new ApiError(
          `Failed to add item. API returned error: ${result.__typename}`,
          errorCode
        )
      }
    } catch (error) {
      console.error('ApiService.addItemToShoppingCart failed:', error)
      // Re-throw for the UI layer to handle
      throw error
    }
  }

  async removeItemFromShoppingCart(
    site: SiteEnum,
    shoppingCartItemId: string
  ): Promise<ShoppingCartModel> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        RemoveItemFromShoppingCartMutation,
        RemoveItemFromShoppingCartMutationVariables
      >({
        mutation: RemoveItemFromShoppingCartDocument,
        variables: {
          site,
          shoppingCartItemId
        },
        fetchPolicy: 'network-only'
      })

      if (errors) {
        throw new ApiError(
          `GraphQL error removing item from cart: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const result = data?.removeItemFromShoppingCart

      if (!result) {
        throw new Error('Did not receive a valid response from the server.')
      }

      if (result.__typename === 'ShoppingCart') {
        // Success: The API returned the updated cart.
        // We map the raw DTO to our rich domain model.
        return createShoppingCartModel(result as unknown as GqlShoppingCart)
      } else {
        // Business logic error (e.g., ShoppingCartItemNotFound).
        // We throw a structured error for the UI layer to handle.
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        throw new ApiError(
          `Failed to remove item. API returned error: ${result.__typename}`,
          errorCode
        )
      }
    } catch (error) {
      // Catch and re-throw any error for the calling function to handle.
      console.error('ApiService.removeItemFromShoppingCart failed:', error)
      throw error
    }
  }

  async updateItemInShoppingCart(
    site: SiteEnum,
    sellableProductId: string,
    quantity: number
  ): Promise<ShoppingCartModel> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        UpdateItemInShoppingCartMutation,
        UpdateItemInShoppingCartMutationVariables
      >({
        mutation: UpdateItemInShoppingCartDocument,
        variables: {
          site,
          shoppingCartItemId: sellableProductId,
          quantity: quantity
        },
        fetchPolicy: 'network-only'
      })

      if (errors) {
        throw new ApiError(
          `GraphQL error updating item in cart: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const result = data?.updateItemInShoppingCart

      if (!result) {
        throw new Error('Did not receive a valid response from the server.')
      }

      if (result.__typename === 'ShoppingCart') {
        // Success: Map the raw DTO to our rich domain model.
        return createShoppingCartModel(result as unknown as GqlShoppingCart)
      } else {
        // Business logic error: Throw a structured error for the UI to handle.
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        throw new ApiError(
          `Failed to update item. API returned error: ${result.__typename}`,
          errorCode
        )
      }
    } catch (error) {
      // Catch and re-throw any error for the calling function to handle.
      console.error('ApiService.updateItemInShoppingCart failed:', error)
      throw error
    }
  }

  async addGiftCardCodeToShoppingCart(giftCard: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async addDiscountCodeToShoppingCart(
    site: SiteEnum,
    discountCode: string
  ): Promise<ShoppingCartModel> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        AddDiscountCodeToShoppingCartMutation,
        AddDiscountCodeToShoppingCartMutationVariables
      >({
        mutation: AddDiscountCodeToShoppingCartDocument,
        variables: {
          site,
          discountCode
        },
        fetchPolicy: 'network-only'
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error applying discount code: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const result = data?.addDiscountCodeToShoppingCart

      if (!result) {
        throw new Error('Did not receive a valid response from the server.')
      }

      if (result.__typename === 'ShoppingCart') {
        return createShoppingCartModel(result as unknown as GqlShoppingCart)
      } else {
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        let errorMessage = 'Invalid discount code.'

        if (result.__typename === 'DiscountCodeIsInvalid') {
          errorMessage = 'The provided discount code is not valid.'
        } else if (result.__typename === 'ShoppingCartIsEmpty') {
          errorMessage = 'Cannot apply a discount code to an empty cart.'
        }

        throw new ApiError(errorMessage, errorCode)
      }
    } catch (error) {
      console.error('ApiService.addDiscountCodeToShoppingCart failed:', error)
      throw error
    }
  }

  async calculateTotalForShoppingCart(site: SiteEnum): Promise<ShoppingCartModel> {
    try {
      const { data, errors } = await this.authApiClient.query<
        CalculateTotalForShoppingCartQuery,
        CalculateTotalForShoppingCartQueryVariables
      >({
        query: CalculateTotalForShoppingCartDocument,
        variables: {
          site: site
        },
        fetchPolicy: 'network-only'
      })

      if (errors) {
        throw new ApiError(
          `GraphQL error calculating cart total: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const result = data?.calculateTotalForShoppingCart

      if (!result) {
        throw new Error('Did not receive a valid response from the server when calculating total.')
      }

      if (result.__typename === 'ShoppingCart') {
        // Success: The API returned the cart with updated totals.
        // We map the raw DTO to our rich domain model.
        return createShoppingCartModel(result as unknown as GqlShoppingCart)
      } else {
        // Business logic error (e.g., ShoppingCartIsEmpty, DiscountCodeIsInvalid).
        // We throw a structured error for the UI layer to handle.
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        throw new ApiError(
          `Could not calculate total. API returned error: ${result.__typename}`,
          errorCode
        )
      }
    } catch (error) {
      // Catch and re-throw any error for the calling function to handle.
      console.error('ApiService.calculateTotalForShoppingCart failed:', error)
      throw error
    }
  }

  async generatePayfortForm(site: SiteEnum, input: PayfortFormInput): Promise<string> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        GeneratePayfortFormMutation,
        GeneratePayfortFormMutationVariables
      >({
        // Use the generated DocumentNode for type safety.
        mutation: GeneratePayfortFormDocument,
        variables: { site, input },
        fetchPolicy: 'network-only' // This is a one-time action.
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error generating Payfort form: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      // A missing or empty HTML form is a critical failure.
      const htmlForm = data?.payfortForm?.htmlForm
      if (!htmlForm) {
        throw new Error('Did not receive a valid HTML form from the server.')
      }

      // On success, return the HTML string.
      return htmlForm
    } catch (error) {
      // Catch and re-throw any error so the calling layer can handle the failure.
      console.error('ApiService.generatePayfortForm failed:', error)
      throw error
    }
  }

  async generateMerchantReference(site: SiteEnum): Promise<string> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        GenerateMerchantReferenceMutation,
        GenerateMerchantReferenceMutationVariables
      >({
        mutation: GenerateMerchantReferenceDocument,
        variables: { site },
        fetchPolicy: 'network-only'
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error generating merchant reference: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      // A missing or empty reference is a critical failure.
      if (!data?.generateMerchantReference) {
        throw new Error('Did not receive a valid merchant reference from the server.')
      }

      // On success, return the reference string.
      return data.generateMerchantReference
    } catch (error) {
      // Catch any error (our thrown errors or network errors) and re-throw it
      // so the calling layer can handle the failure.
      console.error('ApiService.generateMerchantReference failed:', error)
      throw error
    }
  }

  async getCurrentUserSitesWithNames(): Promise<Site[]> {
    const query = gql`
      query CurrentUserSitesWithNames {
        currentUser {
          siteUsers {
            site
          }
        }
        availableSites {
          name
          code
        }
      }
    `
    try {
      const queryResult = await this.authApiClient.query({
        query: query,
        fetchPolicy: 'no-cache'
      })

      const availableSites = queryResult.data.availableSites as Site[]
      const currentUser = queryResult.data.currentUser as User

      const sites: Site[] = []
      currentUser.siteUsers.forEach((siteUser: SimpleSiteUser) => {
        const site = availableSites.find((site: Site) => site.code === siteUser.site)
        if (site) sites.push(site)
      })

      return sites
    } catch (error) {
      return []
    }
  }

  async checkTransactionStatus(merchantReference: string): Promise<PaymentTransactionStatusEnum> {
    const input: PaymentTransactionStatusInput = { merchantReference }

    try {
      const { data, errors } = await this.authApiClient.query<
        PaymentTransactionStatusQuery,
        PaymentTransactionStatusQueryVariables
      >({
        query: PaymentTransactionStatusDocument,
        variables: { input },
        fetchPolicy: 'network-only'
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error fetching transaction status: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const result = data?.paymentTransactionStatus

      if (!result) {
        throw new Error('Did not receive a valid response from the server for transaction status.')
      }

      if (result.__typename === 'PaymentTransactionStatus') {
        // --- Success Path ---
        // The query was successful, return the status enum directly.
        return result.status
      } else {
        // --- Business Logic Error Path ---
        // The API returned a specific error, like 'TemporalTransactionNotFound'.
        // We throw a structured error for the UI to handle.
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        throw new ApiError(
          `Could not get transaction status. API returned error: ${result.__typename}`,
          errorCode
        )
      }
    } catch (error) {
      // --- Network/GraphQL Error Path ---
      // Catch and re-throw any error for the calling function to handle.
      console.error('ApiService.paymentTransactionStatus failed:', error)
      throw error
    }
  }

  async getCartDetails(site: SiteEnum): Promise<ShoppingCartModel | null> {
    try {
      const { data, errors } = await this.authApiClient.query<
        GetShoppingCartQuery,
        GetShoppingCartQueryVariables
      >({
        query: GetShoppingCartDocument,
        variables: { site },
        fetchPolicy: 'network-only'
      })

      if (errors) {
        throw new ApiError(
          `GraphQL error fetching shopping cart: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const cartData = data?.currentUser?.shoppingCart
      if (!cartData) {
        return null
      }

      return createShoppingCartModel(cartData as unknown as GqlShoppingCart)
    } catch (error) {
      console.error('ApiService: Error fetching shopping cart:', error)
      throw new Error('Failed to fetch shopping cart.')
    }
  }

  public async clearShoppingCart(site: SiteEnum): Promise<ShoppingCartModel> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        EmptyShoppingCartMutation,
        EmptyShoppingCartMutationVariables
      >({
        mutation: EmptyShoppingCartDocument,
        variables: { site },
        fetchPolicy: 'network-only'
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error clearing the cart: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const result = data?.emptyShoppingCart

      if (!result) {
        throw new Error('Did not receive a valid response from the server when clearing the cart.')
      }

      if (result.__typename === 'ShoppingCart') {
        // Success: The API returned the empty cart.
        return createShoppingCartModel(result as unknown as GqlShoppingCart)
      } else {
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        throw new ApiError(
          `Could not clear cart. API returned error: ${result.__typename}`,
          errorCode
        )
      }
    } catch (error) {
      // --- Network/GraphQL Error Path ---
      // Catch and re-throw any error for the calling function to handle.
      console.error('ApiService.clearShoppingCart failed:', error)
      throw error
    }
  }

  public async lockShoppingCart(site: SiteEnum): Promise<boolean> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        LockShoppingCartMutation,
        LockShoppingCartMutationVariables
      >({
        mutation: LockShoppingCartDocument,
        variables: { site },
        fetchPolicy: 'network-only'
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error locking the cart: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      if (typeof data?.lockShoppingCart !== 'boolean') {
        throw new Error(
          'Did not receive a valid boolean response from the server when locking the cart.'
        )
      }

      return data.lockShoppingCart
    } catch (error) {
      // --- Network/GraphQL Error Path ---
      // Catch and re-throw any error for the calling function to handle.
      console.error('ApiService.lockShoppingCart failed:', error)
      throw error
    }
  }

  public async removeDiscountCode(site: SiteEnum): Promise<ShoppingCartModel> {
    try {
      const { data, errors } = await this.authApiClient.mutate<
        RemoveDiscountCodeMutation,
        RemoveDiscountCodeMutationVariables
      >({
        mutation: RemoveDiscountCodeDocument,
        variables: { site },
        fetchPolicy: 'network-only'
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error removing discount code: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      const result = data?.removeDiscountCodeForCurrentShoppingCart

      if (!result) {
        throw new Error(
          'Did not receive a valid response from the server when removing discount code.'
        )
      }

      if (result.__typename === 'ShoppingCart') {
        // Success: The API returned the updated cart.
        // We mapped the DTO to our domain model.
        return createShoppingCartModel(result as unknown as GqlShoppingCart)
      } else {
        // Business Error: Cart not found, for example.
        const errorCode = (result as { code?: string }).code ?? 'UnknownBusinessError'
        throw new ApiError(
          `Could not remove discount code. API returned error: ${result.__typename}`,
          errorCode
        )
      }
    } catch (error) {
      // --- Network/GraphQL Error Path ---
      // Catch and re-throw any error for the calling function to handle.
      console.error('ApiService.removeDiscountCode failed:', error)
      throw error
    }
  }

  public async getMyselfBasic(): Promise<BasicUser | null> {
    try {
      const queryResult = await this.authApiClient.query({
        query: GetCurrentUserBasicInfoDocument,
        fetchPolicy: 'network-only'
      })
      return queryResult.data.currentUser ?? null
    } catch (error) {
      console.error('ApiService: Failed to fetch basic user info.', error)
      return null
    }
  }

  public async getCartSummary(site: SiteEnum): Promise<CartSummary | null> {
    try {
      const { data, errors } = await this.authApiClient.query({
        query: GetCartSummaryDocument,
        variables: { site },
        fetchPolicy: 'network-only'
      })

      if (errors && errors.length > 0) {
        throw new ApiError(
          `GraphQL error fetching cart summary: ${errors.map((e) => e.message).join(', ')}`
        )
      }

      return data?.currentUser?.shoppingCart ?? null
    } catch (error) {
      console.error('ApiService.getCartSummary failed:', error)
      return null
    }
  }
}
