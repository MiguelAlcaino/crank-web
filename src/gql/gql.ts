/* eslint-disable */
import * as types from './graphql'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
  '\n      query siteSettings($site: SiteEnum!) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n        }\n      }\n    ':
    types.SiteSettingsDocument,
  '\n      query currentUser {\n        currentUser {\n          email\n          firstName\n          lastName\n          gender\n          birthdate\n          country {\n            name\n            code\n            states {\n              name\n              code\n            }\n          }\n          state {\n            name\n            code\n          }\n          city\n          address1\n          address2\n          zipCode\n          phone\n          emergencyContactName\n          emergencyContactPhone\n          emergencyContactRelationship\n          hideMetrics\n          weight\n          leaderboardUsername\n        }\n      }\n    ':
    types.CurrentUserDocument,
  '\n      query currentUserWorkoutStats($site: SiteEnum!) {\n        currentUserWorkoutStats(site: $site) {\n          classId\n          className\n          startDateTime\n          spotNumber\n          averagePower\n          highPower\n          averageRpm\n          highRpm\n          totalEnergy\n          calories\n          distance\n          duration\n          adjustedChartPoints(amountOfPoints: 62) {\n            time\n            rpm\n            power\n          }\n        }\n      }\n    ':
    types.CurrentUserWorkoutStatsDocument,
  '\n      query currentUserEnrollments($site: SiteEnum!, $params: CurrentUserEnrollmentsParams) {\n        currentUserEnrollments(site: $site, params: $params) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            spotInfo {\n              spotNumber\n              isBooked\n            }\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    ':
    types.CurrentUserEnrollmentsDocument,
  '\n      query currentUserPurchases($site: SiteEnum!) {\n        currentUserPurchases(site: $site) {\n          packageName\n          allowanceObtained\n          allowanceRemaining\n          paymentDateTime\n          activationDateTime\n          expirationDateTime\n        }\n      }\n    ':
    types.CurrentUserPurchasesDocument,
  '\n      query Countries {\n        countries {\n          name\n          code\n        }\n      }\n    ':
    types.CountriesDocument,
  '\n      query country($countryCode: String!) {\n        country(countryCode: $countryCode) {\n          name\n          code\n          states {\n            name\n            code\n          }\n        }\n      }\n    ':
    types.CountryDocument,
  '\n      query calendarClasses($site: SiteEnum!, $params: CalendarClassesParams) {\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n        }\n      }\n    ':
    types.CalendarClassesDocument,
  '\n      query customCalendarClasses(\n        $site: SiteEnum!\n        $params: CalendarClassesParams\n        $enrollmentsWaitlistParams: CurrentUserEnrollmentsParams\n        $enrollmentsUpcomingParams: CurrentUserEnrollmentsParams\n      ) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n        }\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n        }\n        enrollmentsWaitlist: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsWaitlistParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n        enrollmentsUpcoming: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsUpcomingParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    ':
    types.CustomCalendarClassesDocument,
  '\n      query classInfo($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          matrix {\n            __typename\n            x\n            y\n            icon\n            ... on BookableSpot {\n              enabled\n              spotInfo {\n                spotNumber\n                isBooked\n              }\n            }\n          }\n        }\n      }\n    ':
    types.ClassInfoDocument,
  '\n      mutation registerUser($site: SiteEnum!, $input: RegisterUserInput!) {\n        registerUser(site: $site, input: $input) {\n          email\n        }\n      }\n    ':
    types.RegisterUserDocument,
  '\n      mutation updateCurrentUser($input: UserInput!) {\n        updateCurrentUser(input: $input) {\n          email\n        }\n      }\n    ':
    types.UpdateCurrentUserDocument,
  '\n      mutation bookClass($site: SiteEnum!, $input: BookClassInput!) {\n        bookClass(site: $site, input: $input) {\n          __typename\n        }\n      }\n    ':
    types.BookClassDocument,
  '\n      mutation cancelCurrentUserEnrollment($site: SiteEnum!, $input: CancelEnrollmentInput!) {\n        cancelCurrentUserEnrollment(site: $site, input: $input) {\n          __typename\n        }\n      }\n    ':
    types.CancelCurrentUserEnrollmentDocument,
  '\n      mutation removeCurrentUserFromWaitlist(\n        $site: SiteEnum!\n        $input: RemoveCurrentUserFromWaitlistInput!\n      ) {\n        removeCurrentUserFromWaitlist(site: $site, input: $input) {\n          ... on RemoveFromWaitlistResult {\n            success\n          }\n          ... on WaitlistEntryNotFoundError {\n            code\n          }\n        }\n      }\n    ':
    types.RemoveCurrentUserFromWaitlistDocument,
  '\n      mutation disableSpot($input: DisableEnableSpotInput) {\n        disableSpot(input: $input) {\n          __typename\n          ... on DisableEnableSpotResult {\n            __typename\n            result\n          }\n          ... on SpotNotFoundError {\n            __typename\n            code\n          }\n        }\n      }\n    ':
    types.DisableSpotDocument,
  '\n      mutation enableSpot($input: DisableEnableSpotInput) {\n        enableSpot(input: $input) {\n          __typename\n          ... on DisableEnableSpotResult {\n            __typename\n            result\n          }\n          ... on SpotNotFoundError {\n            __typename\n            code\n          }\n        }\n      }\n    ':
    types.EnableSpotDocument
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query siteSettings($site: SiteEnum!) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n        }\n      }\n    '
): (typeof documents)['\n      query siteSettings($site: SiteEnum!) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query currentUser {\n        currentUser {\n          email\n          firstName\n          lastName\n          gender\n          birthdate\n          country {\n            name\n            code\n            states {\n              name\n              code\n            }\n          }\n          state {\n            name\n            code\n          }\n          city\n          address1\n          address2\n          zipCode\n          phone\n          emergencyContactName\n          emergencyContactPhone\n          emergencyContactRelationship\n          hideMetrics\n          weight\n          leaderboardUsername\n        }\n      }\n    '
): (typeof documents)['\n      query currentUser {\n        currentUser {\n          email\n          firstName\n          lastName\n          gender\n          birthdate\n          country {\n            name\n            code\n            states {\n              name\n              code\n            }\n          }\n          state {\n            name\n            code\n          }\n          city\n          address1\n          address2\n          zipCode\n          phone\n          emergencyContactName\n          emergencyContactPhone\n          emergencyContactRelationship\n          hideMetrics\n          weight\n          leaderboardUsername\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query currentUserWorkoutStats($site: SiteEnum!) {\n        currentUserWorkoutStats(site: $site) {\n          classId\n          className\n          startDateTime\n          spotNumber\n          averagePower\n          highPower\n          averageRpm\n          highRpm\n          totalEnergy\n          calories\n          distance\n          duration\n          adjustedChartPoints(amountOfPoints: 62) {\n            time\n            rpm\n            power\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserWorkoutStats($site: SiteEnum!) {\n        currentUserWorkoutStats(site: $site) {\n          classId\n          className\n          startDateTime\n          spotNumber\n          averagePower\n          highPower\n          averageRpm\n          highRpm\n          totalEnergy\n          calories\n          distance\n          duration\n          adjustedChartPoints(amountOfPoints: 62) {\n            time\n            rpm\n            power\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query currentUserEnrollments($site: SiteEnum!, $params: CurrentUserEnrollmentsParams) {\n        currentUserEnrollments(site: $site, params: $params) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            spotInfo {\n              spotNumber\n              isBooked\n            }\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserEnrollments($site: SiteEnum!, $params: CurrentUserEnrollmentsParams) {\n        currentUserEnrollments(site: $site, params: $params) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            spotInfo {\n              spotNumber\n              isBooked\n            }\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query currentUserPurchases($site: SiteEnum!) {\n        currentUserPurchases(site: $site) {\n          packageName\n          allowanceObtained\n          allowanceRemaining\n          paymentDateTime\n          activationDateTime\n          expirationDateTime\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserPurchases($site: SiteEnum!) {\n        currentUserPurchases(site: $site) {\n          packageName\n          allowanceObtained\n          allowanceRemaining\n          paymentDateTime\n          activationDateTime\n          expirationDateTime\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query Countries {\n        countries {\n          name\n          code\n        }\n      }\n    '
): (typeof documents)['\n      query Countries {\n        countries {\n          name\n          code\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query country($countryCode: String!) {\n        country(countryCode: $countryCode) {\n          name\n          code\n          states {\n            name\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query country($countryCode: String!) {\n        country(countryCode: $countryCode) {\n          name\n          code\n          states {\n            name\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query calendarClasses($site: SiteEnum!, $params: CalendarClassesParams) {\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n        }\n      }\n    '
): (typeof documents)['\n      query calendarClasses($site: SiteEnum!, $params: CalendarClassesParams) {\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query customCalendarClasses(\n        $site: SiteEnum!\n        $params: CalendarClassesParams\n        $enrollmentsWaitlistParams: CurrentUserEnrollmentsParams\n        $enrollmentsUpcomingParams: CurrentUserEnrollmentsParams\n      ) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n        }\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n        }\n        enrollmentsWaitlist: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsWaitlistParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n        enrollmentsUpcoming: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsUpcomingParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query customCalendarClasses(\n        $site: SiteEnum!\n        $params: CalendarClassesParams\n        $enrollmentsWaitlistParams: CurrentUserEnrollmentsParams\n        $enrollmentsUpcomingParams: CurrentUserEnrollmentsParams\n      ) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n        }\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n        }\n        enrollmentsWaitlist: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsWaitlistParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n        enrollmentsUpcoming: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsUpcomingParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query classInfo($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          matrix {\n            __typename\n            x\n            y\n            icon\n            ... on BookableSpot {\n              enabled\n              spotInfo {\n                spotNumber\n                isBooked\n              }\n            }\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query classInfo($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          matrix {\n            __typename\n            x\n            y\n            icon\n            ... on BookableSpot {\n              enabled\n              spotInfo {\n                spotNumber\n                isBooked\n              }\n            }\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation registerUser($site: SiteEnum!, $input: RegisterUserInput!) {\n        registerUser(site: $site, input: $input) {\n          email\n        }\n      }\n    '
): (typeof documents)['\n      mutation registerUser($site: SiteEnum!, $input: RegisterUserInput!) {\n        registerUser(site: $site, input: $input) {\n          email\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation updateCurrentUser($input: UserInput!) {\n        updateCurrentUser(input: $input) {\n          email\n        }\n      }\n    '
): (typeof documents)['\n      mutation updateCurrentUser($input: UserInput!) {\n        updateCurrentUser(input: $input) {\n          email\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation bookClass($site: SiteEnum!, $input: BookClassInput!) {\n        bookClass(site: $site, input: $input) {\n          __typename\n        }\n      }\n    '
): (typeof documents)['\n      mutation bookClass($site: SiteEnum!, $input: BookClassInput!) {\n        bookClass(site: $site, input: $input) {\n          __typename\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation cancelCurrentUserEnrollment($site: SiteEnum!, $input: CancelEnrollmentInput!) {\n        cancelCurrentUserEnrollment(site: $site, input: $input) {\n          __typename\n        }\n      }\n    '
): (typeof documents)['\n      mutation cancelCurrentUserEnrollment($site: SiteEnum!, $input: CancelEnrollmentInput!) {\n        cancelCurrentUserEnrollment(site: $site, input: $input) {\n          __typename\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation removeCurrentUserFromWaitlist(\n        $site: SiteEnum!\n        $input: RemoveCurrentUserFromWaitlistInput!\n      ) {\n        removeCurrentUserFromWaitlist(site: $site, input: $input) {\n          ... on RemoveFromWaitlistResult {\n            success\n          }\n          ... on WaitlistEntryNotFoundError {\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation removeCurrentUserFromWaitlist(\n        $site: SiteEnum!\n        $input: RemoveCurrentUserFromWaitlistInput!\n      ) {\n        removeCurrentUserFromWaitlist(site: $site, input: $input) {\n          ... on RemoveFromWaitlistResult {\n            success\n          }\n          ... on WaitlistEntryNotFoundError {\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation disableSpot($input: DisableEnableSpotInput) {\n        disableSpot(input: $input) {\n          __typename\n          ... on DisableEnableSpotResult {\n            __typename\n            result\n          }\n          ... on SpotNotFoundError {\n            __typename\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation disableSpot($input: DisableEnableSpotInput) {\n        disableSpot(input: $input) {\n          __typename\n          ... on DisableEnableSpotResult {\n            __typename\n            result\n          }\n          ... on SpotNotFoundError {\n            __typename\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation enableSpot($input: DisableEnableSpotInput) {\n        enableSpot(input: $input) {\n          __typename\n          ... on DisableEnableSpotResult {\n            __typename\n            result\n          }\n          ... on SpotNotFoundError {\n            __typename\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation enableSpot($input: DisableEnableSpotInput) {\n        enableSpot(input: $input) {\n          __typename\n          ... on DisableEnableSpotResult {\n            __typename\n            result\n          }\n          ... on SpotNotFoundError {\n            __typename\n            code\n          }\n        }\n      }\n    ']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
