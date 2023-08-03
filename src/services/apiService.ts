import { gql } from '@apollo/client'
import type {
  BookClassInput,
  BookUserIntoClassInput,
  CalendarClassesParams,
  CancelEnrollmentInput,
  Class,
  ClassInfo,
  ClassStat,
  Country,
  CurrentUserEnrollmentsParams,
  DisableEnableSpotInput,
  DisableEnableSpotResult,
  DisableEnableSpotResultUnion,
  DoesRoomLayoutMatchResultUnion,
  EditClassInput,
  EditClassResultUnion,
  Enrollment,
  IdentifiableUser,
  Purchase,
  RegisterUserInput,
  RemoveCurrentUserFromWaitlistInput,
  SiteEnum,
  User,
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

  async getCurrentUserWorkoutStats(site: SiteEnum): Promise<ClassStat | null> {
    const CURRENT_USER_WORKOUT_STATS_QUERY = gql`
      query currentUserWorkoutStats($site: SiteEnum!) {
        currentUserWorkoutStats(site: $site) {
          classId
          className
          startDateTime
          spotNumber
          averagePower
          highPower
          averageRpm
          highRpm
          totalEnergy
          calories
          distance
          duration
          adjustedChartPoints(amountOfPoints: 62) {
            time
            rpm
            power
          }
        }
      }
    `
    try {
      const queryResult = await this.authApiClient.query({
        query: CURRENT_USER_WORKOUT_STATS_QUERY,
        variables: {
          site: site
        }
      })

      return queryResult.data.currentUserWorkoutStats as ClassStat
    } catch (error) {
      return null
    }
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
            spotInfo {
              spotNumber
              isBooked
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
    try {
      const queryResult = await this.authApiClient.query({
        query: CURRENT_USER_ENROLLMENTS_QUERY,
        variables: {
          site: site,
          params: params
        },
        fetchPolicy: 'network-only'
      })

      return queryResult.data.currentUserEnrollments as Enrollment[]
    } catch (error) {
      return []
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
          start
          startWithNoTimeZone
          duration
          waitListAvailable
        }
      }
    `
    try {
      const stgStartDate = dayjs(startDate).format('YYYY-MM-DD')
      const stgEndDate = dayjs(endDate).format('YYYY-MM-DD')

      const params: CalendarClassesParams = {
        startDate: stgStartDate,
        endDate: stgEndDate
      }

      const queryResult = await this.authApiClient.query({
        query: CALENDAR_CLASSES_QUERY,
        variables: {
          site: site,
          params: params
        }
      })

      return queryResult.data.calendarClasses as Class[]
    } catch (error) {
      return []
    }
  }

  async getCustomCalendarClasses(
    site: SiteEnum,
    startDate: Date,
    endDate: Date
  ): Promise<CustomCalendarClasses | null> {
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

    try {
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
    } catch (error) {
      return null
    }
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
          matrix {
            __typename
            x
            y
            icon
            ... on BookableSpot {
              enabled
              spotInfo {
                spotNumber
                isBooked
                bookedSpotUserInfo {
                  enrollmentId
                  user {
                    firstName
                    lastName
                    email
                  }
                }
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
      console.log(error)
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
    spotNumber: number,
    isPaymentRequired: boolean,
    isWaitlistBooking: boolean
  ): Promise<string> {
    const input = {
      classId: classId,
      spotNumber: spotNumber,
      userId: userId,
      isPaymentRequired: isPaymentRequired,
      isWaitlistBooking: isWaitlistBooking
    } as BookUserIntoClassInput

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

  async doesClassMatchPIQLayout(
    site: SiteEnum,
    classId: string
  ): Promise<DoesRoomLayoutMatchResultUnion> {
    const DOES_CLASS_MATCH_PIQ_LAYOUT_QUERY = gql`
      query doesClassMatchPIQLayout($site: SiteEnum!, $classId: ID!) {
        doesClassMatchPIQLayout(site: $site, classId: $classId) {
          __typename
          ... on PIQClassHasNoRoomLayoutError {
            __typename
          }
          ... on PIQClassNotLinkedError {
            __typename
          }
          ... on RoomLayoutIdDoesNotMatchError {
            __typename
            urlToCreateRoomLayout
            currentRoomLayout {
              __typename
              id
              name
            }
            suggestedRoomLayout {
              __typename
              id
              name
            }
          }
          ... on RoomLayoutStructureMatchResult {
            matchesPIQRoomLayout
          }
        }
      }
    `

    const queryResult = await this.authApiClient.query({
      query: DOES_CLASS_MATCH_PIQ_LAYOUT_QUERY,
      variables: {
        site: site,
        classId: classId
      },
      fetchPolicy: 'network-only'
    })

    return queryResult.data.doesClassMatchPIQLayout as DoesRoomLayoutMatchResultUnion
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
          ... on PIQClassNotFoundError {
            __typename
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
}
