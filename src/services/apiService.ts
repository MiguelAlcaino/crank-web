import { gql } from '@apollo/client'
import type {
  BookClassInput,
  CalendarClassesParams,
  CancelEnrollmentInput,
  Class,
  ClassInfo,
  ClassStat,
  Country,
  CreateCurrentUserInSiteUnion,
  CurrentUserEnrollmentsParams,
  EditClassInput,
  EditClassResultUnion,
  EditEnrollmentInput,
  EditEnrollmentResultUnion,
  Enrollment,
  EnrollmentInfo,
  Purchase,
  RegisterUserInput,
  RemoveCurrentUserFromWaitlistInput,
  RemoveUserFromWaitlistInput,
  RemoveUserFromWaitlistUnion,
  RequestPasswordLinkInput,
  ResetPasswordForCurrentUserInput,
  ResetPasswordForCurrentUserUnion,
  ResetPasswordLinkResultUnion,
  SiteEnum,
  UpdateCurrentUserPasswordInput,
  User,
  UserInClassRanking,
  UserInRankingParams,
  UserInput,
  AcceptLateCancelledSpotInClassInput,
  AcceptLateCancelledSpotInClassResultUnion,
  RejectLateCancelledSpotInClassInput,
  RejectLateBookingResultUnion,
  SimpleSiteUser,
  PaginationInput,
  PaginatedEnrollments,
  PaginatedClassStats,
  PaginatedPurchases,
  SmsValidationUnion,
  IsSmsValidationCodeValidUnion,
  Site
} from '@/gql/graphql'
import { EnrollmentTypeEnum, type SiteSetting } from '@/gql/graphql'
import { ApolloClient, ApolloError } from '@apollo/client/core'
import { CustomCalendarClasses } from '@/model/CustomCalendarClasses'
import { SmsValidationResponse } from '@/modules/buy_packages/models/sms-validation-response'
import { IsSmsValidationCodeValidResponse } from '@/modules/buy_packages/models/is-sms-validation-code-valid-response'

export class ApiService {
  authApiClient: ApolloClient<any>
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

  async getCurrentUserWorkoutStats(site: SiteEnum): Promise<ClassStat[]> {
    const query = gql`
      query currentUserWorkoutStats($site: SiteEnum!) {
        currentUserWorkoutStats(site: $site) {
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
      }
    `

    const queryResult = await this.authApiClient.query({
      query: query,
      variables: {
        site: site
      },
      fetchPolicy: 'network-only'
    })

    return queryResult.data.currentUserWorkoutStats as ClassStat[]
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

  async getCurrentUserEnrollments(
    site: SiteEnum,
    params: CurrentUserEnrollmentsParams
  ): Promise<Enrollment[]> {
    const CURRENT_USER_ENROLLMENTS_QUERY = gql`
      query currentUserEnrollments($site: SiteEnum!, $params: CurrentUserEnrollmentsParams) {
        currentUserEnrollments(site: $site, params: $params) {
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
      }
    `

    const queryResult = await this.authApiClient.query({
      query: CURRENT_USER_ENROLLMENTS_QUERY,
      variables: {
        site: site,
        params: params
      },
      fetchPolicy: 'network-only'
    })

    return queryResult.data.currentUserEnrollments as Enrollment[]
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

  async getCurrentUserPurchases(site: SiteEnum): Promise<Purchase[]> {
    const CURRENT_USER_PURCHASES_QUERY = gql`
      query currentUserPurchases($site: SiteEnum!) {
        currentUserPurchases(site: $site) {
          packageName
          allowanceObtained
          allowanceRemaining
          paymentDateTime
          activationDateTime
          expirationDateTime
        }
      }
    `
    try {
      const queryResult = await this.authApiClient.query({
        query: CURRENT_USER_PURCHASES_QUERY,
        variables: {
          site: site
        }
      })

      return queryResult.data.currentUserPurchases as Purchase[]
    } catch (error) {
      return []
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

      return new SmsValidationResponse(smsValidation.__typename)
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
      return new IsSmsValidationCodeValidResponse(response.__typename)
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
}
