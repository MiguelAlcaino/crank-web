/* eslint-disable */
import * as types from './graphql'
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

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
  '\n      query currentUserWorkoutStats($site: SiteEnum!) {\n        currentUserWorkoutStats(site: $site) {\n          enrollment {\n            enrollmentInfo {\n              id\n              ... on EnrollmentInfo {\n                spotNumber\n              }\n            }\n            class {\n              name\n              start\n              duration\n            }\n          }\n          totalEnergy\n        }\n      }\n    ':
    types.CurrentUserWorkoutStatsDocument,
  '\n      query currentUserSingleWorkoutStat($enrollmentId: ID!) {\n        currentUserSingleWorkoutStat(enrollmentId: $enrollmentId) {\n          enrollment {\n            enrollmentInfo {\n              id\n              ... on EnrollmentInfo {\n                spotNumber\n              }\n            }\n            class {\n              id\n              name\n              start\n              duration\n              instructorName\n            }\n          }\n          averagePower\n          highPower\n          averageRpm\n          highRpm\n          totalEnergy\n          calories\n          distance\n          adjustedChartPoints(amountOfPoints: 62) {\n            time\n            rpm\n            power\n          }\n        }\n      }\n    ':
    types.CurrentUserSingleWorkoutStatDocument,
  '\n      query currentUserEnrollments($site: SiteEnum!, $params: CurrentUserEnrollmentsParams) {\n        currentUserEnrollments(site: $site, params: $params) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            ... on EnrollmentInfo {\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    ':
    types.CurrentUserEnrollmentsDocument,
  '\n      query currentUserEnrollmentInClass($classId: ID!) {\n        currentUser {\n          enrollmentInClass(classId: $classId) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            ... on EnrollmentInfo {\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n        }\n      }\n    ':
    types.CurrentUserEnrollmentInClassDocument,
  '\n      query currentUserPurchases($site: SiteEnum!) {\n        currentUserPurchases(site: $site) {\n          packageName\n          allowanceObtained\n          allowanceRemaining\n          paymentDateTime\n          activationDateTime\n          expirationDateTime\n        }\n      }\n    ':
    types.CurrentUserPurchasesDocument,
  '\n      query Countries {\n        countries {\n          name\n          code\n        }\n      }\n    ':
    types.CountriesDocument,
  '\n      query country($countryCode: String!) {\n        country(countryCode: $countryCode) {\n          name\n          code\n          states {\n            name\n            code\n          }\n        }\n      }\n    ':
    types.CountryDocument,
  '\n      query calendarClasses($site: SiteEnum!, $params: CalendarClassesParams) {\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          isSubstitute\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n          bookingWindow {\n            startDateTime\n            endDateTime\n          }\n        }\n      }\n    ':
    types.CalendarClassesDocument,
  '\n      query customCalendarClasses(\n        $site: SiteEnum!\n        $params: CalendarClassesParams\n        $enrollmentsWaitlistParams: CurrentUserEnrollmentsParams\n        $enrollmentsUpcomingParams: CurrentUserEnrollmentsParams\n      ) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n        }\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n          isSubstitute\n          bookingWindow {\n            startDateTime\n            endDateTime\n          }\n        }\n        enrollmentsWaitlist: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsWaitlistParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n        enrollmentsUpcoming: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsUpcomingParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    ':
    types.CustomCalendarClassesDocument,
  '\n      query classInfo($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          roomLayout {\n            id\n            name\n            matrix {\n              __typename\n              x\n              y\n              icon\n              ... on BookableSpot {\n                enabled\n                spotNumber\n                spotInfo {\n                  spotNumber\n                  isBooked\n                }\n              }\n            }\n          }\n          enrollments(status: active) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            ... on EnrollmentInfo {\n              isCheckedIn\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n        }\n      }\n    ':
    types.ClassInfoDocument,
  '\n      query classInfoAdmin($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          roomLayout {\n            id\n            name\n            matrix {\n              __typename\n              x\n              y\n              icon\n              ... on BookableSpot {\n                enabled\n                spotNumber\n                spotInfo {\n                  spotNumber\n                  isBooked\n                }\n              }\n            }\n          }\n          enrollments(status: active) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            identifiableUser {\n              id\n              user {\n                __typename\n                firstName\n                lastName\n                email\n                leaderboardUsername\n              }\n            }\n\n            ... on EnrollmentInfo {\n              isCheckedIn\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n          onHoldSpots\n        }\n      }\n    ':
    types.ClassInfoAdminDocument,
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
    types.EnableSpotDocument,
  '\n      query searchUser($site: SiteEnum!, $query: String) {\n        searchUser(site: $site, query: $query) {\n          id\n          user {\n            firstName\n            lastName\n            email\n          }\n        }\n      }\n    ':
    types.SearchUserDocument,
  '\n      mutation bookUserIntoClass($input: BookUserIntoClassInput!) {\n        bookUserIntoClass(input: $input) {\n          __typename\n        }\n      }\n    ':
    types.BookUserIntoClassDocument,
  '\n      mutation removeUserFromClass($input: CancelEnrollmentInput!) {\n        removeUserFromClass(input: $input) {\n          __typename\n        }\n      }\n    ':
    types.RemoveUserFromClassDocument,
  '\n      mutation editClass($input: EditClassInput!) {\n        editClass(input: $input) {\n          __typename\n          ... on EditClassSuccessResult {\n            __typename\n            updated\n          }\n        }\n      }\n    ':
    types.EditClassDocument,
  '\n      mutation updateCurrentUserPassword(\n        $site: SiteEnum!\n        $input: UpdateCurrentUserPasswordInput!\n      ) {\n        updateCurrentUserPassword(site: $site, input: $input)\n      }\n    ':
    types.UpdateCurrentUserPasswordDocument,
  '\n      mutation editCurrentUserEnrollment($site: SiteEnum!, $input: EditEnrollmentInput!) {\n        editCurrentUserEnrollment(site: $site, input: $input) {\n          __typename\n          ... on SpotAlreadyReservedError {\n            code\n          }\n          ... on TryToSwitchToSameSpotError {\n            code\n          }\n          ... on ClientIsOutsideSchedulingWindowError {\n            code\n          }\n        }\n      }\n    ':
    types.EditCurrentUserEnrollmentDocument,
  '\n      mutation requestPasswordLink($site: SiteEnum!, $input: RequestPasswordLinkInput) {\n        requestPasswordLink(site: $site, input: $input) {\n          ... on TooManyResetPasswordLinkRequestsError {\n            availableAgainAt\n          }\n          ... on ResetPasswordLinkSentSuccessfully {\n            status\n          }\n        }\n      }\n    ':
    types.RequestPasswordLinkDocument,
  '\n      mutation resetPasswordForCurrentUser($input: ResetPasswordForCurrentUserInput) {\n        resetPasswordForCurrentUser(input: $input) {\n          __typename\n          ... on PasswordsDontMatchError {\n            __typename\n            code\n          }\n          ... on ResetPasswordSuccess {\n            __typename\n            status\n          }\n        }\n      }\n    ':
    types.ResetPasswordForCurrentUserDocument,
  '\n      query currentUserDoesExistInSite($site: SiteEnum!) {\n        currentUser {\n          doesExistInSite(site: $site)\n        }\n      }\n    ':
    types.CurrentUserDoesExistInSiteDocument,
  '\n      mutation createCurrentUserInSite($fromSite: SiteEnum!, $toSite: SiteEnum!) {\n        createCurrentUserInSite(fromSite: $fromSite, toSite: $toSite) {\n          ... on CreateCurrentUserInSiteSuccess {\n            __typename\n            result\n          }\n          ... on UserAlreadyExistsError {\n            __typename\n            code\n          }\n        }\n      }\n    ':
    types.CreateCurrentUserInSiteDocument,
  '\n      query roomLayouts($site: SiteEnum!) {\n        roomLayouts(site: $site) {\n          id\n          name\n        }\n      }\n    ':
    types.RoomLayoutsDocument,
  '\n      query roomLayout($site: SiteEnum!, $id: ID!) {\n        roomLayout(site: $site, id: $id) {\n          id\n          name\n          columns\n          rows\n          matrix {\n            x\n            y\n            icon\n            ... on BookableSpot {\n              spotNumber\n            }\n          }\n        }\n      }\n    ':
    types.RoomLayoutDocument,
  '\n      mutation createRoomLayout($site: SiteEnum!, $input: RoomLayoutInput!) {\n        createRoomLayout(site: $site, input: $input) {\n          id\n        }\n      }\n    ':
    types.CreateRoomLayoutDocument,
  '\n      mutation editRoomLayout($site: SiteEnum!, $input: EditRoomLayoutInput!) {\n        editRoomLayout(site: $site, input: $input) {\n          id\n        }\n      }\n    ':
    types.EditRoomLayoutDocument,
  '\n      query classWaitlistEntries($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          enrollments(status: waitlisted) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            identifiableUser {\n              id\n              user {\n                firstName\n                lastName\n              }\n            }\n          }\n        }\n      }\n    ':
    types.ClassWaitlistEntriesDocument,
  '\n      mutation removeUserFromWaitlist($input: RemoveUserFromWaitlistInput!) {\n        removeUserFromWaitlist(input: $input) {\n          ... on RemoveFromWaitlistResult {\n            success\n          }\n          ... on WaitlistEntryNotFoundError {\n            code\n          }\n        }\n      }\n    ':
    types.RemoveUserFromWaitlistDocument,
  '\n      mutation checkinUserInClass($site: SiteEnum!, $input: CheckinUserInClass!) {\n        checkinUserInClass(site: $site, input: $input) {\n          __typename\n          ... on CheckinSuccess {\n            success\n          }\n          ... on EnrollmentNotFoundError {\n            code\n          }\n        }\n      }\n    ':
    types.CheckinUserInClassDocument,
  '\n      mutation checkoutUserInClass($site: SiteEnum!, $input: CheckoutUserInClass!) {\n        checkoutUserInClass(site: $site, input: $input) {\n          __typename\n          ... on CheckoutSuccess {\n            success\n          }\n          ... on EnrollmentNotFoundError {\n            code\n          }\n        }\n      }\n    ':
    types.CheckoutUserInClassDocument,
  '\n      mutation editEnrollment($site: SiteEnum!, $input: EditEnrollmentInput!) {\n        editEnrollment(site: $site, input: $input) {\n          __typename\n          ... on Enrollment {\n            __typename\n          }\n          ... on SpotAlreadyReservedError {\n            code\n          }\n          ... on TryToSwitchToSameSpotError {\n            code\n          }\n          ... on ClientIsOutsideSchedulingWindowError {\n            code\n          }\n        }\n      }\n    ':
    types.EditEnrollmentDocument,
  '\n      mutation swapSpot($site: SiteEnum!, $input: EditEnrollmentInput!) {\n        swapSpot(site: $site, input: $input) {\n          __typename\n          ... on SwapSpotSuccess {\n            __typename\n          }\n          ... on TryToSwitchToSameSpotError {\n            __typename\n            code\n          }\n        }\n      }\n    ':
    types.SwapSpotDocument,
  '\n      query currentUserSites {\n        currentUser {\n          existsInSites\n        }\n      }\n    ':
    types.CurrentUserSitesDocument,
  '\n      query currentUserRankingInClass($site: SiteEnum!, $params: UserInRankingParams) {\n        currentUserRankingInClass(site: $site, params: $params) {\n          totalRanking {\n            positionInRanking\n            totalMembersInRanking\n          }\n          genderRanking {\n            gender\n            ranking {\n              positionInRanking\n              totalMembersInRanking\n            }\n          }\n        }\n      }\n    ':
    types.CurrentUserRankingInClassDocument,
  '\n      query getCalendarClassesForList($site: SiteEnum!, $params: CalendarClassesParams) {\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          startWithNoTimeZone\n          maxCapacity\n          totalBooked\n          totalUnderMaintenanceSpots\n        }\n      }\n    ':
    types.GetCalendarClassesForListDocument,
  '\n      query getUser($id: ID!) {\n        user(id: $id) {\n          id\n          user {\n            firstName\n            lastName\n            email\n            leaderboardUsername\n            weight\n            gender\n            birthdate\n            country {\n              code\n              name\n            }\n            state {\n              code\n              name\n            }\n            city\n            address1\n            address2\n            zipCode\n            phone\n            emergencyContactName\n            emergencyContactPhone\n            emergencyContactRelationship\n            hideMetrics\n            existsInSites\n          }\n        }\n      }\n    ':
    types.GetUserDocument,
  '\n      query classWaitlistIsEnabled($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            waitListAvailable\n          }\n        }\n      }\n    ':
    types.ClassWaitlistIsEnabledDocument,
  '\n      mutation syncClass($site: SiteEnum!, $classId: ID!) {\n        syncClass(site: $site, classId: $classId) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          roomLayout {\n            id\n            name\n            matrix {\n              __typename\n              x\n              y\n              icon\n              ... on BookableSpot {\n                enabled\n                spotNumber\n                spotInfo {\n                  spotNumber\n                  isBooked\n                }\n              }\n            }\n          }\n          enrollments(status: active) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            identifiableUser {\n              id\n              user {\n                __typename\n                firstName\n                lastName\n                email\n                leaderboardUsername\n              }\n            }\n\n            ... on EnrollmentInfo {\n              isCheckedIn\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n          onHoldSpots\n        }\n      }\n    ':
    types.SyncClassDocument,
  '\n      mutation syncAllClasses($site: SiteEnum!) {\n        syncAllClasses(site: $site) {\n          id\n        }\n      }\n    ':
    types.SyncAllClassesDocument
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
  source: '\n      query currentUserWorkoutStats($site: SiteEnum!) {\n        currentUserWorkoutStats(site: $site) {\n          enrollment {\n            enrollmentInfo {\n              id\n              ... on EnrollmentInfo {\n                spotNumber\n              }\n            }\n            class {\n              name\n              start\n              duration\n            }\n          }\n          totalEnergy\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserWorkoutStats($site: SiteEnum!) {\n        currentUserWorkoutStats(site: $site) {\n          enrollment {\n            enrollmentInfo {\n              id\n              ... on EnrollmentInfo {\n                spotNumber\n              }\n            }\n            class {\n              name\n              start\n              duration\n            }\n          }\n          totalEnergy\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query currentUserSingleWorkoutStat($enrollmentId: ID!) {\n        currentUserSingleWorkoutStat(enrollmentId: $enrollmentId) {\n          enrollment {\n            enrollmentInfo {\n              id\n              ... on EnrollmentInfo {\n                spotNumber\n              }\n            }\n            class {\n              id\n              name\n              start\n              duration\n              instructorName\n            }\n          }\n          averagePower\n          highPower\n          averageRpm\n          highRpm\n          totalEnergy\n          calories\n          distance\n          adjustedChartPoints(amountOfPoints: 62) {\n            time\n            rpm\n            power\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserSingleWorkoutStat($enrollmentId: ID!) {\n        currentUserSingleWorkoutStat(enrollmentId: $enrollmentId) {\n          enrollment {\n            enrollmentInfo {\n              id\n              ... on EnrollmentInfo {\n                spotNumber\n              }\n            }\n            class {\n              id\n              name\n              start\n              duration\n              instructorName\n            }\n          }\n          averagePower\n          highPower\n          averageRpm\n          highRpm\n          totalEnergy\n          calories\n          distance\n          adjustedChartPoints(amountOfPoints: 62) {\n            time\n            rpm\n            power\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query currentUserEnrollments($site: SiteEnum!, $params: CurrentUserEnrollmentsParams) {\n        currentUserEnrollments(site: $site, params: $params) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            ... on EnrollmentInfo {\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserEnrollments($site: SiteEnum!, $params: CurrentUserEnrollmentsParams) {\n        currentUserEnrollments(site: $site, params: $params) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            ... on EnrollmentInfo {\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query currentUserEnrollmentInClass($classId: ID!) {\n        currentUser {\n          enrollmentInClass(classId: $classId) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            ... on EnrollmentInfo {\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserEnrollmentInClass($classId: ID!) {\n        currentUser {\n          enrollmentInClass(classId: $classId) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            ... on EnrollmentInfo {\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n        }\n      }\n    ']
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
  source: '\n      query calendarClasses($site: SiteEnum!, $params: CalendarClassesParams) {\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          isSubstitute\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n          bookingWindow {\n            startDateTime\n            endDateTime\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query calendarClasses($site: SiteEnum!, $params: CalendarClassesParams) {\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          isSubstitute\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n          bookingWindow {\n            startDateTime\n            endDateTime\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query customCalendarClasses(\n        $site: SiteEnum!\n        $params: CalendarClassesParams\n        $enrollmentsWaitlistParams: CurrentUserEnrollmentsParams\n        $enrollmentsUpcomingParams: CurrentUserEnrollmentsParams\n      ) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n        }\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n          isSubstitute\n          bookingWindow {\n            startDateTime\n            endDateTime\n          }\n        }\n        enrollmentsWaitlist: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsWaitlistParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n        enrollmentsUpcoming: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsUpcomingParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query customCalendarClasses(\n        $site: SiteEnum!\n        $params: CalendarClassesParams\n        $enrollmentsWaitlistParams: CurrentUserEnrollmentsParams\n        $enrollmentsUpcomingParams: CurrentUserEnrollmentsParams\n      ) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n        }\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n          isSubstitute\n          bookingWindow {\n            startDateTime\n            endDateTime\n          }\n        }\n        enrollmentsWaitlist: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsWaitlistParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n        enrollmentsUpcoming: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsUpcomingParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query classInfo($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          roomLayout {\n            id\n            name\n            matrix {\n              __typename\n              x\n              y\n              icon\n              ... on BookableSpot {\n                enabled\n                spotNumber\n                spotInfo {\n                  spotNumber\n                  isBooked\n                }\n              }\n            }\n          }\n          enrollments(status: active) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            ... on EnrollmentInfo {\n              isCheckedIn\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query classInfo($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          roomLayout {\n            id\n            name\n            matrix {\n              __typename\n              x\n              y\n              icon\n              ... on BookableSpot {\n                enabled\n                spotNumber\n                spotInfo {\n                  spotNumber\n                  isBooked\n                }\n              }\n            }\n          }\n          enrollments(status: active) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            ... on EnrollmentInfo {\n              isCheckedIn\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query classInfoAdmin($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          roomLayout {\n            id\n            name\n            matrix {\n              __typename\n              x\n              y\n              icon\n              ... on BookableSpot {\n                enabled\n                spotNumber\n                spotInfo {\n                  spotNumber\n                  isBooked\n                }\n              }\n            }\n          }\n          enrollments(status: active) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            identifiableUser {\n              id\n              user {\n                __typename\n                firstName\n                lastName\n                email\n                leaderboardUsername\n              }\n            }\n\n            ... on EnrollmentInfo {\n              isCheckedIn\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n          onHoldSpots\n        }\n      }\n    '
): (typeof documents)['\n      query classInfoAdmin($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          roomLayout {\n            id\n            name\n            matrix {\n              __typename\n              x\n              y\n              icon\n              ... on BookableSpot {\n                enabled\n                spotNumber\n                spotInfo {\n                  spotNumber\n                  isBooked\n                }\n              }\n            }\n          }\n          enrollments(status: active) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            identifiableUser {\n              id\n              user {\n                __typename\n                firstName\n                lastName\n                email\n                leaderboardUsername\n              }\n            }\n\n            ... on EnrollmentInfo {\n              isCheckedIn\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n          onHoldSpots\n        }\n      }\n    ']
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
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query searchUser($site: SiteEnum!, $query: String) {\n        searchUser(site: $site, query: $query) {\n          id\n          user {\n            firstName\n            lastName\n            email\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query searchUser($site: SiteEnum!, $query: String) {\n        searchUser(site: $site, query: $query) {\n          id\n          user {\n            firstName\n            lastName\n            email\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation bookUserIntoClass($input: BookUserIntoClassInput!) {\n        bookUserIntoClass(input: $input) {\n          __typename\n        }\n      }\n    '
): (typeof documents)['\n      mutation bookUserIntoClass($input: BookUserIntoClassInput!) {\n        bookUserIntoClass(input: $input) {\n          __typename\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation removeUserFromClass($input: CancelEnrollmentInput!) {\n        removeUserFromClass(input: $input) {\n          __typename\n        }\n      }\n    '
): (typeof documents)['\n      mutation removeUserFromClass($input: CancelEnrollmentInput!) {\n        removeUserFromClass(input: $input) {\n          __typename\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation editClass($input: EditClassInput!) {\n        editClass(input: $input) {\n          __typename\n          ... on EditClassSuccessResult {\n            __typename\n            updated\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation editClass($input: EditClassInput!) {\n        editClass(input: $input) {\n          __typename\n          ... on EditClassSuccessResult {\n            __typename\n            updated\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation updateCurrentUserPassword(\n        $site: SiteEnum!\n        $input: UpdateCurrentUserPasswordInput!\n      ) {\n        updateCurrentUserPassword(site: $site, input: $input)\n      }\n    '
): (typeof documents)['\n      mutation updateCurrentUserPassword(\n        $site: SiteEnum!\n        $input: UpdateCurrentUserPasswordInput!\n      ) {\n        updateCurrentUserPassword(site: $site, input: $input)\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation editCurrentUserEnrollment($site: SiteEnum!, $input: EditEnrollmentInput!) {\n        editCurrentUserEnrollment(site: $site, input: $input) {\n          __typename\n          ... on SpotAlreadyReservedError {\n            code\n          }\n          ... on TryToSwitchToSameSpotError {\n            code\n          }\n          ... on ClientIsOutsideSchedulingWindowError {\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation editCurrentUserEnrollment($site: SiteEnum!, $input: EditEnrollmentInput!) {\n        editCurrentUserEnrollment(site: $site, input: $input) {\n          __typename\n          ... on SpotAlreadyReservedError {\n            code\n          }\n          ... on TryToSwitchToSameSpotError {\n            code\n          }\n          ... on ClientIsOutsideSchedulingWindowError {\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation requestPasswordLink($site: SiteEnum!, $input: RequestPasswordLinkInput) {\n        requestPasswordLink(site: $site, input: $input) {\n          ... on TooManyResetPasswordLinkRequestsError {\n            availableAgainAt\n          }\n          ... on ResetPasswordLinkSentSuccessfully {\n            status\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation requestPasswordLink($site: SiteEnum!, $input: RequestPasswordLinkInput) {\n        requestPasswordLink(site: $site, input: $input) {\n          ... on TooManyResetPasswordLinkRequestsError {\n            availableAgainAt\n          }\n          ... on ResetPasswordLinkSentSuccessfully {\n            status\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation resetPasswordForCurrentUser($input: ResetPasswordForCurrentUserInput) {\n        resetPasswordForCurrentUser(input: $input) {\n          __typename\n          ... on PasswordsDontMatchError {\n            __typename\n            code\n          }\n          ... on ResetPasswordSuccess {\n            __typename\n            status\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation resetPasswordForCurrentUser($input: ResetPasswordForCurrentUserInput) {\n        resetPasswordForCurrentUser(input: $input) {\n          __typename\n          ... on PasswordsDontMatchError {\n            __typename\n            code\n          }\n          ... on ResetPasswordSuccess {\n            __typename\n            status\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query currentUserDoesExistInSite($site: SiteEnum!) {\n        currentUser {\n          doesExistInSite(site: $site)\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserDoesExistInSite($site: SiteEnum!) {\n        currentUser {\n          doesExistInSite(site: $site)\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation createCurrentUserInSite($fromSite: SiteEnum!, $toSite: SiteEnum!) {\n        createCurrentUserInSite(fromSite: $fromSite, toSite: $toSite) {\n          ... on CreateCurrentUserInSiteSuccess {\n            __typename\n            result\n          }\n          ... on UserAlreadyExistsError {\n            __typename\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation createCurrentUserInSite($fromSite: SiteEnum!, $toSite: SiteEnum!) {\n        createCurrentUserInSite(fromSite: $fromSite, toSite: $toSite) {\n          ... on CreateCurrentUserInSiteSuccess {\n            __typename\n            result\n          }\n          ... on UserAlreadyExistsError {\n            __typename\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query roomLayouts($site: SiteEnum!) {\n        roomLayouts(site: $site) {\n          id\n          name\n        }\n      }\n    '
): (typeof documents)['\n      query roomLayouts($site: SiteEnum!) {\n        roomLayouts(site: $site) {\n          id\n          name\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query roomLayout($site: SiteEnum!, $id: ID!) {\n        roomLayout(site: $site, id: $id) {\n          id\n          name\n          columns\n          rows\n          matrix {\n            x\n            y\n            icon\n            ... on BookableSpot {\n              spotNumber\n            }\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query roomLayout($site: SiteEnum!, $id: ID!) {\n        roomLayout(site: $site, id: $id) {\n          id\n          name\n          columns\n          rows\n          matrix {\n            x\n            y\n            icon\n            ... on BookableSpot {\n              spotNumber\n            }\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation createRoomLayout($site: SiteEnum!, $input: RoomLayoutInput!) {\n        createRoomLayout(site: $site, input: $input) {\n          id\n        }\n      }\n    '
): (typeof documents)['\n      mutation createRoomLayout($site: SiteEnum!, $input: RoomLayoutInput!) {\n        createRoomLayout(site: $site, input: $input) {\n          id\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation editRoomLayout($site: SiteEnum!, $input: EditRoomLayoutInput!) {\n        editRoomLayout(site: $site, input: $input) {\n          id\n        }\n      }\n    '
): (typeof documents)['\n      mutation editRoomLayout($site: SiteEnum!, $input: EditRoomLayoutInput!) {\n        editRoomLayout(site: $site, input: $input) {\n          id\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query classWaitlistEntries($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          enrollments(status: waitlisted) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            identifiableUser {\n              id\n              user {\n                firstName\n                lastName\n              }\n            }\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query classWaitlistEntries($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          enrollments(status: waitlisted) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            identifiableUser {\n              id\n              user {\n                firstName\n                lastName\n              }\n            }\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation removeUserFromWaitlist($input: RemoveUserFromWaitlistInput!) {\n        removeUserFromWaitlist(input: $input) {\n          ... on RemoveFromWaitlistResult {\n            success\n          }\n          ... on WaitlistEntryNotFoundError {\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation removeUserFromWaitlist($input: RemoveUserFromWaitlistInput!) {\n        removeUserFromWaitlist(input: $input) {\n          ... on RemoveFromWaitlistResult {\n            success\n          }\n          ... on WaitlistEntryNotFoundError {\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation checkinUserInClass($site: SiteEnum!, $input: CheckinUserInClass!) {\n        checkinUserInClass(site: $site, input: $input) {\n          __typename\n          ... on CheckinSuccess {\n            success\n          }\n          ... on EnrollmentNotFoundError {\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation checkinUserInClass($site: SiteEnum!, $input: CheckinUserInClass!) {\n        checkinUserInClass(site: $site, input: $input) {\n          __typename\n          ... on CheckinSuccess {\n            success\n          }\n          ... on EnrollmentNotFoundError {\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation checkoutUserInClass($site: SiteEnum!, $input: CheckoutUserInClass!) {\n        checkoutUserInClass(site: $site, input: $input) {\n          __typename\n          ... on CheckoutSuccess {\n            success\n          }\n          ... on EnrollmentNotFoundError {\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation checkoutUserInClass($site: SiteEnum!, $input: CheckoutUserInClass!) {\n        checkoutUserInClass(site: $site, input: $input) {\n          __typename\n          ... on CheckoutSuccess {\n            success\n          }\n          ... on EnrollmentNotFoundError {\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation editEnrollment($site: SiteEnum!, $input: EditEnrollmentInput!) {\n        editEnrollment(site: $site, input: $input) {\n          __typename\n          ... on Enrollment {\n            __typename\n          }\n          ... on SpotAlreadyReservedError {\n            code\n          }\n          ... on TryToSwitchToSameSpotError {\n            code\n          }\n          ... on ClientIsOutsideSchedulingWindowError {\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation editEnrollment($site: SiteEnum!, $input: EditEnrollmentInput!) {\n        editEnrollment(site: $site, input: $input) {\n          __typename\n          ... on Enrollment {\n            __typename\n          }\n          ... on SpotAlreadyReservedError {\n            code\n          }\n          ... on TryToSwitchToSameSpotError {\n            code\n          }\n          ... on ClientIsOutsideSchedulingWindowError {\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation swapSpot($site: SiteEnum!, $input: EditEnrollmentInput!) {\n        swapSpot(site: $site, input: $input) {\n          __typename\n          ... on SwapSpotSuccess {\n            __typename\n          }\n          ... on TryToSwitchToSameSpotError {\n            __typename\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation swapSpot($site: SiteEnum!, $input: EditEnrollmentInput!) {\n        swapSpot(site: $site, input: $input) {\n          __typename\n          ... on SwapSpotSuccess {\n            __typename\n          }\n          ... on TryToSwitchToSameSpotError {\n            __typename\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query currentUserSites {\n        currentUser {\n          existsInSites\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserSites {\n        currentUser {\n          existsInSites\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query currentUserRankingInClass($site: SiteEnum!, $params: UserInRankingParams) {\n        currentUserRankingInClass(site: $site, params: $params) {\n          totalRanking {\n            positionInRanking\n            totalMembersInRanking\n          }\n          genderRanking {\n            gender\n            ranking {\n              positionInRanking\n              totalMembersInRanking\n            }\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserRankingInClass($site: SiteEnum!, $params: UserInRankingParams) {\n        currentUserRankingInClass(site: $site, params: $params) {\n          totalRanking {\n            positionInRanking\n            totalMembersInRanking\n          }\n          genderRanking {\n            gender\n            ranking {\n              positionInRanking\n              totalMembersInRanking\n            }\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query getCalendarClassesForList($site: SiteEnum!, $params: CalendarClassesParams) {\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          startWithNoTimeZone\n          maxCapacity\n          totalBooked\n          totalUnderMaintenanceSpots\n        }\n      }\n    '
): (typeof documents)['\n      query getCalendarClassesForList($site: SiteEnum!, $params: CalendarClassesParams) {\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          startWithNoTimeZone\n          maxCapacity\n          totalBooked\n          totalUnderMaintenanceSpots\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query getUser($id: ID!) {\n        user(id: $id) {\n          id\n          user {\n            firstName\n            lastName\n            email\n            leaderboardUsername\n            weight\n            gender\n            birthdate\n            country {\n              code\n              name\n            }\n            state {\n              code\n              name\n            }\n            city\n            address1\n            address2\n            zipCode\n            phone\n            emergencyContactName\n            emergencyContactPhone\n            emergencyContactRelationship\n            hideMetrics\n            existsInSites\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query getUser($id: ID!) {\n        user(id: $id) {\n          id\n          user {\n            firstName\n            lastName\n            email\n            leaderboardUsername\n            weight\n            gender\n            birthdate\n            country {\n              code\n              name\n            }\n            state {\n              code\n              name\n            }\n            city\n            address1\n            address2\n            zipCode\n            phone\n            emergencyContactName\n            emergencyContactPhone\n            emergencyContactRelationship\n            hideMetrics\n            existsInSites\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query classWaitlistIsEnabled($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            waitListAvailable\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query classWaitlistIsEnabled($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            waitListAvailable\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation syncClass($site: SiteEnum!, $classId: ID!) {\n        syncClass(site: $site, classId: $classId) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          roomLayout {\n            id\n            name\n            matrix {\n              __typename\n              x\n              y\n              icon\n              ... on BookableSpot {\n                enabled\n                spotNumber\n                spotInfo {\n                  spotNumber\n                  isBooked\n                }\n              }\n            }\n          }\n          enrollments(status: active) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            identifiableUser {\n              id\n              user {\n                __typename\n                firstName\n                lastName\n                email\n                leaderboardUsername\n              }\n            }\n\n            ... on EnrollmentInfo {\n              isCheckedIn\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n          onHoldSpots\n        }\n      }\n    '
): (typeof documents)['\n      mutation syncClass($site: SiteEnum!, $classId: ID!) {\n        syncClass(site: $site, classId: $classId) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          roomLayout {\n            id\n            name\n            matrix {\n              __typename\n              x\n              y\n              icon\n              ... on BookableSpot {\n                enabled\n                spotNumber\n                spotInfo {\n                  spotNumber\n                  isBooked\n                }\n              }\n            }\n          }\n          enrollments(status: active) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            identifiableUser {\n              id\n              user {\n                __typename\n                firstName\n                lastName\n                email\n                leaderboardUsername\n              }\n            }\n\n            ... on EnrollmentInfo {\n              isCheckedIn\n              spotNumber\n              spotInfo {\n                __typename\n                isBooked\n                spotNumber\n              }\n            }\n          }\n          onHoldSpots\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation syncAllClasses($site: SiteEnum!) {\n        syncAllClasses(site: $site) {\n          id\n        }\n      }\n    '
): (typeof documents)['\n      mutation syncAllClasses($site: SiteEnum!) {\n        syncAllClasses(site: $site) {\n          id\n        }\n      }\n    ']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
