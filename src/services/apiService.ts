import { gql } from '@apollo/client'
import type {
  BookClassInput,
  BookUserIntoClassInput,
  CalendarClassesParams,
  CancelEnrollmentInput,
  CheckinResultUnion,
  CheckinUserInClass,
  CheckoutResultUnion,
  CheckoutUserInClass,
  Class,
  ClassInfo,
  ClassStat,
  Country,
  CreateCurrentUserInSiteUnion,
  CurrentUserEnrollmentsParams,
  DisableEnableSpotInput,
  DisableEnableSpotResult,
  DisableEnableSpotResultUnion,
  EditClassInput,
  EditClassResultUnion,
  EditEnrollmentInput,
  EditEnrollmentResultUnion,
  EditRoomLayoutInput,
  Enrollment,
  EnrollmentInfo,
  EnrollmentInfoInterface,
  IdentifiableUser,
  Purchase,
  RegisterUserInput,
  RemoveCurrentUserFromWaitlistInput,
  RemoveUserFromWaitlistInput,
  RemoveUserFromWaitlistUnion,
  RequestPasswordLinkInput,
  ResetPasswordForCurrentUserInput,
  ResetPasswordForCurrentUserUnion,
  ResetPasswordLinkResultUnion,
  RoomLayout,
  RoomLayoutInput,
  SiteEnum,
  SwapSpotResultUnion,
  UpdateCurrentUserPasswordInput,
  User,
  UserInClassRanking,
  UserInRankingParams,
  UserInput
} from '@/gql/graphql'
import { EnrollmentTypeEnum, type SiteSetting } from '@/gql/graphql'
import { ApolloClient, ApolloError } from '@apollo/client/core'
import { CustomCalendarClasses } from '@/model/CustomCalendarClasses'
import dayjs from 'dayjs'

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
      }
    })

    return queryResult.data.currentUserWorkoutStats as ClassStat[]
  }

  async currentUserSingleWorkoutStat(enrollmentId: string): Promise<ClassStat> {
    const query = gql`
      query currentUserSingleWorkoutStat($enrollmentId: ID!) {
        currentUserSingleWorkoutStat(enrollmentId: $enrollmentId) {
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
            ... on EnrollmentInfo {
              spotNumber
              spotInfo {
                __typename
                isBooked
                spotNumber
              }
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
              spotInfo {
                __typename
                isBooked
                spotNumber
              }
            }
          }
        }
      }
    `
    try {
      const queryResult = await this.authApiClient.query({
        query: CURRENT_USER_ENROLLMENT_IN_CLASS_QUERY,
        variables: { classId: classId },
        fetchPolicy: 'network-only'
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

  async getCalendarClasses(site: SiteEnum, startDate: Date, endDate: Date): Promise<Class[]> {
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
        }
      }
    `

    const stgStartDate = dayjs(startDate).format('YYYY-MM-DD')
    const stgEndDate = dayjs(endDate).format('YYYY-MM-DD')

    const params: CalendarClassesParams = {
      startDate: stgStartDate,
      endDate: stgEndDate
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
    startDate: Date,
    endDate: Date
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

    const stgStartDate = dayjs(startDate).format('YYYY-MM-DD')
    const stgEndDate = dayjs(endDate).format('YYYY-MM-DD')

    const params: CalendarClassesParams = {
      startDate: stgStartDate,
      endDate: stgEndDate
    }

    const enrollmentsWaitlistParams: CurrentUserEnrollmentsParams = {
      enrollmentType: EnrollmentTypeEnum.Waitlist,
      startDate: stgStartDate,
      endDate: stgEndDate
    }

    const enrollmentsUpcomingParams: CurrentUserEnrollmentsParams = {
      enrollmentType: EnrollmentTypeEnum.Upcoming,
      startDate: stgStartDate,
      endDate: stgEndDate
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
          roomLayout {
            id
            name
            matrix {
              __typename
              x
              y
              icon
              ... on BookableSpot {
                enabled
                spotNumber
                spotInfo {
                  spotNumber
                  isBooked
                }
              }
            }
          }
          enrollments(status: active) {
            id
            enrollmentStatus
            enrollmentDateTime
            identifiableUser {
              id
              user {
                __typename
                firstName
                lastName
                email
                leaderboardUsername
              }
            }

            ... on EnrollmentInfo {
              isCheckedIn
              spotNumber
              spotInfo {
                __typename
                isBooked
                spotNumber
              }
            }
          }
          onHoldSpots
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

  async disableSpot(classId: string, spotNumber?: number): Promise<string> {
    const input = { classId: classId, spotNumber: spotNumber } as DisableEnableSpotInput

    const DISABLE_SPOT_MUTATION = gql`
      mutation disableSpot($input: DisableEnableSpotInput) {
        disableSpot(input: $input) {
          __typename
          ... on DisableEnableSpotResult {
            __typename
            result
          }
          ... on SpotNotFoundError {
            __typename
            code
          }
        }
      }
    `

    try {
      const result = await this.authApiClient.mutate({
        mutation: DISABLE_SPOT_MUTATION,
        variables: {
          input: input
        },
        fetchPolicy: 'network-only'
      })

      const disableEnableSpotResultUnion = result.data.disableSpot as DisableEnableSpotResultUnion

      if (disableEnableSpotResultUnion.__typename === 'DisableEnableSpotResult') {
        const disableEnableSpotResult = disableEnableSpotResultUnion as DisableEnableSpotResult

        if (disableEnableSpotResult.result === true) {
          return 'Success'
        } else {
          return 'Error'
        }
      } else if (disableEnableSpotResultUnion.__typename === 'SpotNotFoundError') {
        return 'SpotNotFoundError'
      } else {
        return 'UnknownError'
      }
    } catch (error) {
      return 'UnknownError'
    }
  }

  async enableSpot(classId: string, spotNumber?: number): Promise<string> {
    const input = { classId: classId, spotNumber: spotNumber } as DisableEnableSpotInput

    const ENABLE_SPOT_MUTATION = gql`
      mutation enableSpot($input: DisableEnableSpotInput) {
        enableSpot(input: $input) {
          __typename
          ... on DisableEnableSpotResult {
            __typename
            result
          }
          ... on SpotNotFoundError {
            __typename
            code
          }
        }
      }
    `

    try {
      const result = await this.authApiClient.mutate({
        mutation: ENABLE_SPOT_MUTATION,
        variables: {
          input: input
        },
        fetchPolicy: 'network-only'
      })

      const disableEnableSpotResultUnion = result.data.enableSpot as DisableEnableSpotResultUnion

      if (disableEnableSpotResultUnion.__typename === 'DisableEnableSpotResult') {
        const disableEnableSpotResult = disableEnableSpotResultUnion as DisableEnableSpotResult

        if (disableEnableSpotResult.result === true) {
          return 'Success'
        } else {
          return 'Error'
        }
      } else if (disableEnableSpotResultUnion.__typename === 'SpotNotFoundError') {
        return 'SpotNotFoundError'
      } else {
        return 'UnknownError'
      }
    } catch (error) {
      return 'UnknownError'
    }
  }

  async searchUser(site: SiteEnum, query: string): Promise<IdentifiableUser[] | []> {
    if (query.length < 3) return []

    const SEARCH_USER_QUERY = gql`
      query searchUser($site: SiteEnum!, $query: String) {
        searchUser(site: $site, query: $query) {
          id
          user {
            firstName
            lastName
            email
          }
        }
      }
    `
    try {
      const queryResult = await this.authApiClient.query({
        query: SEARCH_USER_QUERY,
        variables: {
          site: site,
          query: query
        },
        fetchPolicy: 'network-only'
      })

      return queryResult.data.searchUser as IdentifiableUser[]
    } catch (error) {
      return []
    }
  }

  async bookUserIntoClass(
    classId: string,
    userId: string,
    spotNumber?: number | null,
    isPaymentRequired?: boolean | null,
    isWaitlistBooking?: boolean | null
  ): Promise<string> {
    const input = {
      classId: classId,
      spotNumber: spotNumber,
      userId: userId,
      isPaymentRequired: isPaymentRequired,
      isWaitlistBooking: isWaitlistBooking
    } as BookUserIntoClassInput

    if (spotNumber) input.spotNumber = spotNumber

    if (isPaymentRequired) input.isPaymentRequired = isPaymentRequired

    if (isWaitlistBooking) input.isWaitlistBooking = isWaitlistBooking

    const BOOK_USER_INTO_CLASS_MUTATION = gql`
      mutation bookUserIntoClass($input: BookUserIntoClassInput!) {
        bookUserIntoClass(input: $input) {
          __typename
        }
      }
    `

    try {
      const result = await this.authApiClient.mutate({
        mutation: BOOK_USER_INTO_CLASS_MUTATION,
        variables: {
          input: input
        },
        fetchPolicy: 'network-only'
      })

      return result.data.bookUserIntoClass.__typename
    } catch (error) {
      return 'UnknownError'
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

    const muration = gql`
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
        mutation: muration,
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

  async requestPasswordLink(
    site: SiteEnum,
    email: string
  ): Promise<ResetPasswordLinkResultUnion | null> {
    const input = { email: email } as RequestPasswordLinkInput

    const muration = gql`
      mutation requestPasswordLink($site: SiteEnum!, $input: RequestPasswordLinkInput) {
        requestPasswordLink(site: $site, input: $input) {
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
        mutation: muration,
        variables: {
          site: site,
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

    const muration = gql`
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
        mutation: muration,
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
    const muration = gql`
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
        mutation: muration,
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

  async roomLayouts(site: SiteEnum): Promise<RoomLayout[] | null> {
    const query = gql`
      query roomLayouts($site: SiteEnum!) {
        roomLayouts(site: $site) {
          id
          name
        }
      }
    `
    try {
      const queryResult = await this.authApiClient.query({
        query: query,
        variables: {
          site: site,
          query: query
        },
        fetchPolicy: 'network-only'
      })

      return queryResult.data.roomLayouts as RoomLayout[]
    } catch (error) {
      return null
    }
  }

  async roomLayout(site: SiteEnum, id: string): Promise<RoomLayout | null> {
    const query = gql`
      query roomLayout($site: SiteEnum!, $id: ID!) {
        roomLayout(site: $site, id: $id) {
          id
          name
          columns
          rows
          matrix {
            x
            y
            icon
            ... on BookableSpot {
              spotNumber
            }
          }
        }
      }
    `
    try {
      const queryResult = await this.authApiClient.query({
        query: query,
        variables: {
          site: site,
          id: id,
          query: query
        },
        fetchPolicy: 'network-only'
      })

      return queryResult.data.roomLayout as RoomLayout
    } catch (error) {
      return null
    }
  }

  async createRoomLayout(site: SiteEnum, input: RoomLayoutInput): Promise<RoomLayout | null> {
    const muration = gql`
      mutation createRoomLayout($site: SiteEnum!, $input: RoomLayoutInput!) {
        createRoomLayout(site: $site, input: $input) {
          id
        }
      }
    `

    try {
      const result = await this.authApiClient.mutate({
        mutation: muration,
        variables: {
          site: site,
          input: input
        },
        fetchPolicy: 'network-only'
      })

      return result.data.createRoomLayout as RoomLayout
    } catch (error) {
      return null
    }
  }

  async editRoomLayout(site: SiteEnum, input: EditRoomLayoutInput): Promise<RoomLayout | null> {
    const muration = gql`
      mutation editRoomLayout($site: SiteEnum!, $input: EditRoomLayoutInput!) {
        editRoomLayout(site: $site, input: $input) {
          id
        }
      }
    `

    try {
      const result = await this.authApiClient.mutate({
        mutation: muration,
        variables: {
          site: site,
          input: input
        },
        fetchPolicy: 'network-only'
      })

      return result.data.editRoomLayout as RoomLayout
    } catch (error) {
      return null
    }
  }

  async getClassWaitlistEntries(
    site: SiteEnum,
    classId: string
  ): Promise<EnrollmentInfoInterface[] | null> {
    const query = gql`
      query classWaitlistEntries($site: SiteEnum!, $id: ID!) {
        classInfo(site: $site, id: $id) {
          enrollments(status: waitlisted) {
            id
            enrollmentStatus
            enrollmentDateTime
            identifiableUser {
              id
              user {
                firstName
                lastName
              }
            }
          }
        }
      }
    `

    const queryResult = await this.authApiClient.query({
      query: query,
      variables: {
        site: site,
        id: classId,
        query: query
      },
      fetchPolicy: 'no-cache'
    })

    const classInfo = queryResult.data.classInfo as ClassInfo

    return classInfo.enrollments
  }

  async removeUserFromWaitlist(waitlistEntryId: string): Promise<RemoveUserFromWaitlistUnion> {
    const input = { waitlistEntryId: waitlistEntryId } as RemoveUserFromWaitlistInput

    const muration = gql`
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
      mutation: muration,
      variables: {
        input: input
      },
      fetchPolicy: 'no-cache'
    })

    return result.data.removeUserFromWaitlist as RemoveUserFromWaitlistUnion
  }

  async checkinUserInClass(site: SiteEnum, input: CheckinUserInClass): Promise<CheckinResultUnion> {
    const mutation = gql`
      mutation checkinUserInClass($site: SiteEnum!, $input: CheckinUserInClass!) {
        checkinUserInClass(site: $site, input: $input) {
          __typename
          ... on CheckinSuccess {
            success
          }
          ... on EnrollmentNotFoundError {
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
      fetchPolicy: 'network-only'
    })

    return result.data.checkinUserInClass as CheckinResultUnion
  }

  async checkoutUserInClass(
    site: SiteEnum,
    input: CheckoutUserInClass
  ): Promise<CheckoutResultUnion> {
    const mutation = gql`
      mutation checkoutUserInClass($site: SiteEnum!, $input: CheckoutUserInClass!) {
        checkoutUserInClass(site: $site, input: $input) {
          __typename
          ... on CheckoutSuccess {
            success
          }
          ... on EnrollmentNotFoundError {
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
      fetchPolicy: 'network-only'
    })

    return result.data.checkoutUserInClass as CheckoutResultUnion
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

  async swapSpot(site: SiteEnum, input: EditEnrollmentInput): Promise<SwapSpotResultUnion> {
    const mutation = gql`
      mutation swapSpot($site: SiteEnum!, $input: EditEnrollmentInput!) {
        swapSpot(site: $site, input: $input) {
          __typename
          ... on SwapSpotSuccess {
            __typename
          }
          ... on TryToSwitchToSameSpotError {
            __typename
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

    return result.data.swapSpot as SwapSpotResultUnion
  }

  async getCurrentUserSites(): Promise<SiteEnum[]> {
    const query = gql`
      query currentUserSites {
        currentUser {
          existsInSites
        }
      }
    `

    const queryResult = await this.authApiClient.query({
      query: query,
      fetchPolicy: 'no-cache'
    })

    const currentUser = queryResult.data.currentUser as User

    return currentUser.existsInSites as SiteEnum[]
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

  async getCalendarClassesForList(
    site: SiteEnum,
    startDate: Date,
    endDate: Date
  ): Promise<Class[]> {
    const query = gql`
      query getCalendarClassesForList($site: SiteEnum!, $params: CalendarClassesParams) {
        calendarClasses(site: $site, params: $params) {
          id
          name
          startWithNoTimeZone
          maxCapacity
          totalBooked
          totalUnderMaintenanceSpots
        }
      }
    `

    const stgStartDate = dayjs(startDate).format('YYYY-MM-DD')
    const stgEndDate = dayjs(endDate).format('YYYY-MM-DD')

    const params: CalendarClassesParams = {
      startDate: stgStartDate,
      endDate: stgEndDate
    }

    const queryResult = await this.authApiClient.query({
      query: query,
      fetchPolicy: 'no-cache',
      variables: {
        site: site,
        params: params
      }
    })

    return queryResult.data.calendarClasses as Class[]
  }

  async getUser(id: string): Promise<IdentifiableUser> {
    const query = gql`
      query getUser($id: ID!) {
        user(id: $id) {
          id
          user {
            firstName
            lastName
            email
            leaderboardUsername
            weight
            gender
            birthdate
            country {
              code
              name
            }
            state {
              code
              name
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
            existsInSites
          }
        }
      }
    `

    const queryResult = await this.authApiClient.query({
      query: query,
      fetchPolicy: 'no-cache',
      variables: {
        id: id
      }
    })

    return queryResult.data.user as IdentifiableUser
  }
}
