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
  '\n      query siteSettings($site: SiteEnum!) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n          siteTimezone\n        }\n      }\n    ':
    types.SiteSettingsDocument,
  '\n      query currentUser {\n        currentUser {\n          email\n          firstName\n          lastName\n          gender\n          birthdate\n          country {\n            name\n            code\n            states {\n              name\n              code\n            }\n          }\n          state {\n            name\n            code\n          }\n          city\n          address1\n          address2\n          zipCode\n          phone\n          emergencyContactName\n          emergencyContactPhone\n          emergencyContactRelationship\n          hideMetrics\n          weight\n          leaderboardUsername\n        }\n      }\n    ':
    types.CurrentUserDocument,
  '\n      query currentUserSingleWorkoutStat($enrollmentId: ID!) {\n        currentUserSingleWorkoutStat(enrollmentId: $enrollmentId) {\n          enrollment {\n            enrollmentInfo {\n              id\n              ... on EnrollmentInfo {\n                spotNumber\n              }\n            }\n            class {\n              id\n              name\n              start\n              duration\n              instructorName\n            }\n          }\n          averagePower\n          highPower\n          averageRpm\n          highRpm\n          totalEnergy\n          calories\n          distance\n          adjustedChartPoints(amountOfPoints: 62) {\n            time\n            rpm\n            power\n          }\n        }\n      }\n    ':
    types.CurrentUserSingleWorkoutStatDocument,
  '\n      query currentUserEnrollmentInClass($classId: ID!) {\n        currentUser {\n          enrollmentInClass(classId: $classId) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            ... on EnrollmentInfo {\n              spotNumber\n            }\n          }\n        }\n      }\n    ':
    types.CurrentUserEnrollmentInClassDocument,
  '\n      query Countries {\n        countries {\n          name\n          code\n        }\n      }\n    ':
    types.CountriesDocument,
  '\n      query country($countryCode: String!) {\n        country(countryCode: $countryCode) {\n          name\n          code\n          states {\n            name\n            code\n          }\n        }\n      }\n    ':
    types.CountryDocument,
  '\n      query calendarClasses($site: SiteEnum!, $params: CalendarClassesParams) {\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          isSubstitute\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n          bookingWindow {\n            startDateTime\n            endDateTime\n          }\n          showAsDisabled\n        }\n      }\n    ':
    types.CalendarClassesDocument,
  '\n      query customCalendarClasses(\n        $site: SiteEnum!\n        $params: CalendarClassesParams\n        $enrollmentsWaitlistParams: CurrentUserEnrollmentsParams\n        $enrollmentsUpcomingParams: CurrentUserEnrollmentsParams\n      ) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n          siteTimezone\n        }\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n          isSubstitute\n          bookingWindow {\n            startDateTime\n            endDateTime\n          }\n          showAsDisabled\n        }\n        enrollmentsWaitlist: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsWaitlistParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n        enrollmentsUpcoming: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsUpcomingParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    ':
    types.CustomCalendarClassesDocument,
  '\n      query classInfo($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          usedSpots\n          roomLayout {\n            id\n            name\n            matrix {\n              __typename\n              x\n              y\n              icon\n              ... on BookableSpot {\n                spotNumber\n              }\n            }\n          }\n        }\n      }\n    ':
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
  '\n      mutation removeUserFromClass($input: CancelEnrollmentInput!) {\n        removeUserFromClass(input: $input) {\n          __typename\n        }\n      }\n    ':
    types.RemoveUserFromClassDocument,
  '\n      mutation editClass($input: EditClassInput!) {\n        editClass(input: $input) {\n          __typename\n          ... on EditClassSuccessResult {\n            __typename\n            updated\n          }\n        }\n      }\n    ':
    types.EditClassDocument,
  '\n      mutation updateCurrentUserPassword(\n        $site: SiteEnum!\n        $input: UpdateCurrentUserPasswordInput!\n      ) {\n        updateCurrentUserPassword(site: $site, input: $input)\n      }\n    ':
    types.UpdateCurrentUserPasswordDocument,
  '\n      mutation editCurrentUserEnrollment($site: SiteEnum!, $input: EditEnrollmentInput!) {\n        editCurrentUserEnrollment(site: $site, input: $input) {\n          __typename\n          ... on SpotAlreadyReservedError {\n            code\n          }\n          ... on TryToSwitchToSameSpotError {\n            code\n          }\n          ... on ClientIsOutsideSchedulingWindowError {\n            code\n          }\n        }\n      }\n    ':
    types.EditCurrentUserEnrollmentDocument,
  '\n      mutation requestPasswordLink($input: RequestPasswordLinkInput) {\n        requestPasswordLink(input: $input) {\n          ... on TooManyResetPasswordLinkRequestsError {\n            availableAgainAt\n          }\n          ... on ResetPasswordLinkSentSuccessfully {\n            status\n          }\n        }\n      }\n    ':
    types.RequestPasswordLinkDocument,
  '\n      mutation resetPasswordForCurrentUser($input: ResetPasswordForCurrentUserInput) {\n        resetPasswordForCurrentUser(input: $input) {\n          __typename\n          ... on PasswordsDontMatchError {\n            __typename\n            code\n          }\n          ... on ResetPasswordSuccess {\n            __typename\n            status\n          }\n        }\n      }\n    ':
    types.ResetPasswordForCurrentUserDocument,
  '\n      query currentUserDoesExistInSite($site: SiteEnum!) {\n        currentUser {\n          doesExistInSite(site: $site)\n        }\n      }\n    ':
    types.CurrentUserDoesExistInSiteDocument,
  '\n      mutation createCurrentUserInSite($fromSite: SiteEnum!, $toSite: SiteEnum!) {\n        createCurrentUserInSite(fromSite: $fromSite, toSite: $toSite) {\n          ... on CreateCurrentUserInSiteSuccess {\n            __typename\n            result\n          }\n          ... on UserAlreadyExistsError {\n            __typename\n            code\n          }\n        }\n      }\n    ':
    types.CreateCurrentUserInSiteDocument,
  '\n      mutation removeUserFromWaitlist($input: RemoveUserFromWaitlistInput!) {\n        removeUserFromWaitlist(input: $input) {\n          ... on RemoveFromWaitlistResult {\n            success\n          }\n          ... on WaitlistEntryNotFoundError {\n            code\n          }\n        }\n      }\n    ':
    types.RemoveUserFromWaitlistDocument,
  '\n      mutation editEnrollment($site: SiteEnum!, $input: EditEnrollmentInput!) {\n        editEnrollment(site: $site, input: $input) {\n          __typename\n          ... on Enrollment {\n            __typename\n          }\n          ... on SpotAlreadyReservedError {\n            code\n          }\n          ... on TryToSwitchToSameSpotError {\n            code\n          }\n          ... on ClientIsOutsideSchedulingWindowError {\n            code\n          }\n        }\n      }\n    ':
    types.EditEnrollmentDocument,
  '\n      query currentUserSites {\n        currentUser {\n          siteUsers {\n            site\n          }\n        }\n      }\n    ':
    types.CurrentUserSitesDocument,
  '\n      query currentUserRankingInClass($site: SiteEnum!, $params: UserInRankingParams) {\n        currentUserRankingInClass(site: $site, params: $params) {\n          totalRanking {\n            positionInRanking\n            totalMembersInRanking\n          }\n          genderRanking {\n            gender\n            ranking {\n              positionInRanking\n              totalMembersInRanking\n            }\n          }\n        }\n      }\n    ':
    types.CurrentUserRankingInClassDocument,
  '\n      mutation acceptLateCancelledSpotInClass(\n        $site: SiteEnum!\n        $input: AcceptLateCancelledSpotInClassInput!\n      ) {\n        acceptLateCancelledSpotInClass(site: $site, input: $input) {\n          __typename\n          ... on AcceptLateCancelledSpotInClassSuccess {\n            success\n          }\n        }\n      }\n    ':
    types.AcceptLateCancelledSpotInClassDocument,
  '\n      mutation rejectLateCancelledSpotInClass(\n        $site: SiteEnum!\n        $input: RejectLateCancelledSpotInClassInput!\n      ) {\n        rejectLateCancelledSpotInClass(site: $site, input: $input) {\n          __typename\n          ... on Error {\n            code\n          }\n          ... on PositionAlreadyTakenError {\n            code\n          }\n          ... on RejectLateCancelledSpotInClassSuccess {\n            success\n          }\n        }\n      }\n    ':
    types.RejectLateCancelledSpotInClassDocument,
  '\n      query currentUserEnrollmentsPaginated(\n        $site: SiteEnum!\n        $params: CurrentUserEnrollmentsParams\n        $pagination: PaginationInput\n      ) {\n        currentUserEnrollmentsPaginated(site: $site, params: $params, pagination: $pagination) {\n          enrollments {\n            enrollmentInfo {\n              id\n              enrollmentStatus\n              enrollmentDateTime\n              enrollmentDateTimeWithNoTimeZone\n              ... on EnrollmentInfo {\n                spotNumber\n              }\n              ... on WaitlistEntry {\n                canBeTurnedIntoEnrollment\n              }\n            }\n            class {\n              id\n              name\n              description\n              instructorName\n              start\n              startWithNoTimeZone\n              duration\n              waitListAvailable\n              showAsDisabled\n            }\n          }\n          total\n        }\n      }\n    ':
    types.CurrentUserEnrollmentsPaginatedDocument,
  '\n      query currentUserWorkoutStatsPaginated($site: SiteEnum!, $pagination: PaginationInput) {\n        currentUserWorkoutStatsPaginated(site: $site, pagination: $pagination) {\n          classStats {\n            enrollment {\n              enrollmentInfo {\n                id\n                ... on EnrollmentInfo {\n                  spotNumber\n                }\n              }\n              class {\n                name\n                start\n                duration\n              }\n            }\n            totalEnergy\n          }\n          total\n        }\n      }\n    ':
    types.CurrentUserWorkoutStatsPaginatedDocument,
  '\n      query currentUserPurchasesPaginated($site: SiteEnum!, $pagination: PaginationInput) {\n        currentUserPurchasesPaginated(site: $site, pagination: $pagination) {\n          purchases {\n            packageName\n            allowanceObtained\n            allowanceRemaining\n            paymentDateTime\n            activationDateTime\n            expirationDateTime\n            current\n          }\n          total\n        }\n      }\n    ':
    types.CurrentUserPurchasesPaginatedDocument,
  '\n        query currentUserPhoneNumber {\n          currentUser {\n            phone\n          }\n        }\n      ':
    types.CurrentUserPhoneNumberDocument,
  '\n      mutation requestSMSValidation($input: RequestSMSValidationInput!) {\n        requestSMSValidation(input: $input) {\n          ... on MobilePhoneAlreadyVerifiedError {\n            code\n          }\n          ... on SuccessfulRequestSMSValidation {\n            success\n          }\n          ... on MobilePhoneNotValidError {\n            code\n          }\n        }\n      }\n    ':
    types.RequestSmsValidationDocument,
  '\n        query isSMSValidationCodeValid($smsCode: String!) {\n          isSMSValidationCodeValid(smsCode: $smsCode) {\n            ... on SMSCodeValidatedSuccessfully {\n              success\n            }\n            ... on RequestSMSValidationNeededError {\n              code\n            }\n            ... on SMSValidationCodeError {\n              code\n            }\n            ... on MobilePhoneAlreadyVerifiedError {\n              code\n            }\n          }\n        }\n      ':
    types.IsSmsValidationCodeValidDocument,
  '\n        query availableSites {\n          availableSites {\n            name\n            code\n          }\n        }\n      ':
    types.AvailableSitesDocument,
  '\n        query products($site: SiteEnum!, $input: ProductsInput) {\n          products(site: $site, input: $input) {\n            id\n            title\n            subtitle\n            currency\n            buttonText\n            price\n            alertBeforePurchasing {\n              title\n              description\n            }\n            ... on ClassPackageProduct {\n              type\n            }\n          }\n        }\n      ':
    types.ProductsDocument,
  '\n        query currentUserShoppingCart($site: SiteEnum!) {\n          currentUser {\n            shoppingCart(site: $site) {\n              id\n              total\n              currency\n              subTotal\n              giftCardCode\n              discountCode\n              items {\n                id\n                quantity\n                subtotal\n                product {\n                  currency\n                  price\n                  buttonText\n                  title\n                  id\n                }\n              }\n            }\n          }\n        }\n      ':
    types.CurrentUserShoppingCartDocument,
  '\n      mutation addItemToShoppingCart($site: SiteEnum!, $input: ItemToShoppingCartInput) {\n        addItemToShoppingCart(site: $site, input: $input) {\n          __typename\n          ... on ShoppingCart {\n            id\n            total\n            currency\n            subTotal\n            giftCardCode\n            discountCode\n            items {\n              id\n              quantity\n              subtotal\n              product {\n                alertBeforePurchasing {\n                  title\n                  description\n                }\n                currency\n                price\n                buttonText\n                title\n                id\n              }\n            }\n          }\n          ... on ProductNotFound {\n            code\n          }\n          ... on ShoppingCartNotFound {\n            code\n          }\n          ... on ShoppingCartIsEmpty {\n            code\n          }\n          ... on ShoppingCartItemNotFound {\n            code\n          }\n        }\n      }\n    ':
    types.AddItemToShoppingCartDocument,
  '\n      mutation RemoveItemFromShoppingCart($site: SiteEnum!, $shoppingCartItemId: ID!) {\n        removeItemFromShoppingCart(site: $site, shoppingCartItemId: $shoppingCartItemId) {\n          __typename\n          ... on ShoppingCart {\n            id\n            total\n            currency\n            subTotal\n            giftCardCode\n            discountCode\n            items {\n              id\n              quantity\n              subtotal\n              product {\n                alertBeforePurchasing {\n                  title\n                  description\n                }\n                currency\n                price\n                buttonText\n                title\n                id\n              }\n            }\n          }\n          ... on ProductNotFound {\n            code\n          }\n          ... on ShoppingCartNotFound {\n            code\n          }\n          ... on ShoppingCartIsEmpty {\n            code\n          }\n          ... on ShoppingCartItemNotFound {\n            code\n          }\n        }\n      }\n    ':
    types.RemoveItemFromShoppingCartDocument,
  '\n      mutation UpdateItemInShoppingCart($site: SiteEnum!, $input: ItemToShoppingCartInput) {\n        updateItemInShoppingCart(site: $site, input: $input) {\n          ... on ShoppingCart {\n            id\n            total\n            currency\n            subTotal\n            giftCardCode\n            discountCode\n            items {\n              id\n              quantity\n              subtotal\n              product {\n                alertBeforePurchasing {\n                  title\n                  description\n                }\n                currency\n                price\n                buttonText\n                title\n                id\n              }\n            }\n          }\n          ... on ProductNotFound {\n            code\n          }\n          ... on ShoppingCartNotFound {\n            code\n          }\n          ... on ShoppingCartIsEmpty {\n            code\n          }\n          ... on ShoppingCartItemNotFound {\n            code\n          }\n        }\n      }\n    ':
    types.UpdateItemInShoppingCartDocument,
  '\n      query CalculateTotalForShoppingCart($site: SiteEnum!) {\n        calculateTotalForShoppingCart(site: $site) {\n          ... on ShoppingCart {\n            id\n            total\n            currency\n            subTotal\n            giftCardCode\n            discountCode\n            items {\n              id\n              quantity\n              subtotal\n              product {\n                alertBeforePurchasing {\n                  title\n                  description\n                }\n                currency\n                price\n                buttonText\n                title\n                id\n              }\n            }\n          }\n          ... on ProductNotFound {\n            code\n          }\n          ... on ShoppingCartNotFound {\n            code\n          }\n          ... on ShoppingCartIsEmpty {\n            code\n          }\n          ... on ShoppingCartItemNotFound {\n            code\n          }\n        }\n      }\n    ':
    types.CalculateTotalForShoppingCartDocument,
  '\n      mutation PayfortForm($site: SiteEnum!, $input: PayfortFormInput!) {\n        payfortForm(site: $site, input: $input) {\n          htmlForm\n        }\n      }\n    ':
    types.PayfortFormDocument,
  '\n      mutation GenerateMerchantReference($site: SiteEnum!) {\n        generateMerchantReference(site: $site)\n      }\n    ':
    types.GenerateMerchantReferenceDocument,
  '\n      query CurrentUserSites {\n        currentUser {\n          siteUsers {\n            site\n          }\n        }\n        availableSites {\n          name\n          code\n        }\n      }\n    ':
    types.CurrentUserSitesDocument,
  '\n      query PaymentTransactionStatus($input: PaymentTransactionStatusInput) {\n        paymentTransactionStatus(input: $input) {\n          ... on PaymentTransactionStatus {\n            status\n          }\n          ... on TemporalTransactionNotFound {\n            code\n          }\n        }\n      }\n    ':
    types.PaymentTransactionStatusDocument
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
  source: '\n      query siteSettings($site: SiteEnum!) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n          siteTimezone\n        }\n      }\n    '
): (typeof documents)['\n      query siteSettings($site: SiteEnum!) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n          siteTimezone\n        }\n      }\n    ']
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
  source: '\n      query currentUserSingleWorkoutStat($enrollmentId: ID!) {\n        currentUserSingleWorkoutStat(enrollmentId: $enrollmentId) {\n          enrollment {\n            enrollmentInfo {\n              id\n              ... on EnrollmentInfo {\n                spotNumber\n              }\n            }\n            class {\n              id\n              name\n              start\n              duration\n              instructorName\n            }\n          }\n          averagePower\n          highPower\n          averageRpm\n          highRpm\n          totalEnergy\n          calories\n          distance\n          adjustedChartPoints(amountOfPoints: 62) {\n            time\n            rpm\n            power\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserSingleWorkoutStat($enrollmentId: ID!) {\n        currentUserSingleWorkoutStat(enrollmentId: $enrollmentId) {\n          enrollment {\n            enrollmentInfo {\n              id\n              ... on EnrollmentInfo {\n                spotNumber\n              }\n            }\n            class {\n              id\n              name\n              start\n              duration\n              instructorName\n            }\n          }\n          averagePower\n          highPower\n          averageRpm\n          highRpm\n          totalEnergy\n          calories\n          distance\n          adjustedChartPoints(amountOfPoints: 62) {\n            time\n            rpm\n            power\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query currentUserEnrollmentInClass($classId: ID!) {\n        currentUser {\n          enrollmentInClass(classId: $classId) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            ... on EnrollmentInfo {\n              spotNumber\n            }\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserEnrollmentInClass($classId: ID!) {\n        currentUser {\n          enrollmentInClass(classId: $classId) {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n            ... on EnrollmentInfo {\n              spotNumber\n            }\n          }\n        }\n      }\n    ']
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
  source: '\n      query calendarClasses($site: SiteEnum!, $params: CalendarClassesParams) {\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          isSubstitute\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n          bookingWindow {\n            startDateTime\n            endDateTime\n          }\n          showAsDisabled\n        }\n      }\n    '
): (typeof documents)['\n      query calendarClasses($site: SiteEnum!, $params: CalendarClassesParams) {\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          isSubstitute\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n          bookingWindow {\n            startDateTime\n            endDateTime\n          }\n          showAsDisabled\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query customCalendarClasses(\n        $site: SiteEnum!\n        $params: CalendarClassesParams\n        $enrollmentsWaitlistParams: CurrentUserEnrollmentsParams\n        $enrollmentsUpcomingParams: CurrentUserEnrollmentsParams\n      ) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n          siteTimezone\n        }\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n          isSubstitute\n          bookingWindow {\n            startDateTime\n            endDateTime\n          }\n          showAsDisabled\n        }\n        enrollmentsWaitlist: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsWaitlistParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n        enrollmentsUpcoming: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsUpcomingParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query customCalendarClasses(\n        $site: SiteEnum!\n        $params: CalendarClassesParams\n        $enrollmentsWaitlistParams: CurrentUserEnrollmentsParams\n        $enrollmentsUpcomingParams: CurrentUserEnrollmentsParams\n      ) {\n        siteSettings(site: $site) {\n          siteDateTimeNow\n          siteTimezone\n        }\n        calendarClasses(site: $site, params: $params) {\n          id\n          name\n          description\n          instructorName\n          start\n          startWithNoTimeZone\n          duration\n          waitListAvailable\n          isSubstitute\n          bookingWindow {\n            startDateTime\n            endDateTime\n          }\n          showAsDisabled\n        }\n        enrollmentsWaitlist: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsWaitlistParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n        enrollmentsUpcoming: currentUserEnrollments(\n          site: $site\n          params: $enrollmentsUpcomingParams\n        ) {\n          enrollmentInfo {\n            id\n            enrollmentStatus\n            enrollmentDateTime\n          }\n          class {\n            id\n            name\n            description\n            instructorName\n            isSubstitute\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query classInfo($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          usedSpots\n          roomLayout {\n            id\n            name\n            matrix {\n              __typename\n              x\n              y\n              icon\n              ... on BookableSpot {\n                spotNumber\n              }\n            }\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query classInfo($site: SiteEnum!, $id: ID!) {\n        classInfo(site: $site, id: $id) {\n          class {\n            id\n            name\n            description\n            instructorName\n            start\n            startWithNoTimeZone\n            duration\n            waitListAvailable\n          }\n          usedSpots\n          roomLayout {\n            id\n            name\n            matrix {\n              __typename\n              x\n              y\n              icon\n              ... on BookableSpot {\n                spotNumber\n              }\n            }\n          }\n        }\n      }\n    ']
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
  source: '\n      mutation requestPasswordLink($input: RequestPasswordLinkInput) {\n        requestPasswordLink(input: $input) {\n          ... on TooManyResetPasswordLinkRequestsError {\n            availableAgainAt\n          }\n          ... on ResetPasswordLinkSentSuccessfully {\n            status\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation requestPasswordLink($input: RequestPasswordLinkInput) {\n        requestPasswordLink(input: $input) {\n          ... on TooManyResetPasswordLinkRequestsError {\n            availableAgainAt\n          }\n          ... on ResetPasswordLinkSentSuccessfully {\n            status\n          }\n        }\n      }\n    ']
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
  source: '\n      mutation removeUserFromWaitlist($input: RemoveUserFromWaitlistInput!) {\n        removeUserFromWaitlist(input: $input) {\n          ... on RemoveFromWaitlistResult {\n            success\n          }\n          ... on WaitlistEntryNotFoundError {\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation removeUserFromWaitlist($input: RemoveUserFromWaitlistInput!) {\n        removeUserFromWaitlist(input: $input) {\n          ... on RemoveFromWaitlistResult {\n            success\n          }\n          ... on WaitlistEntryNotFoundError {\n            code\n          }\n        }\n      }\n    ']
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
  source: '\n      query currentUserSites {\n        currentUser {\n          siteUsers {\n            site\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserSites {\n        currentUser {\n          siteUsers {\n            site\n          }\n        }\n      }\n    ']
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
  source: '\n      mutation acceptLateCancelledSpotInClass(\n        $site: SiteEnum!\n        $input: AcceptLateCancelledSpotInClassInput!\n      ) {\n        acceptLateCancelledSpotInClass(site: $site, input: $input) {\n          __typename\n          ... on AcceptLateCancelledSpotInClassSuccess {\n            success\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation acceptLateCancelledSpotInClass(\n        $site: SiteEnum!\n        $input: AcceptLateCancelledSpotInClassInput!\n      ) {\n        acceptLateCancelledSpotInClass(site: $site, input: $input) {\n          __typename\n          ... on AcceptLateCancelledSpotInClassSuccess {\n            success\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation rejectLateCancelledSpotInClass(\n        $site: SiteEnum!\n        $input: RejectLateCancelledSpotInClassInput!\n      ) {\n        rejectLateCancelledSpotInClass(site: $site, input: $input) {\n          __typename\n          ... on Error {\n            code\n          }\n          ... on PositionAlreadyTakenError {\n            code\n          }\n          ... on RejectLateCancelledSpotInClassSuccess {\n            success\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation rejectLateCancelledSpotInClass(\n        $site: SiteEnum!\n        $input: RejectLateCancelledSpotInClassInput!\n      ) {\n        rejectLateCancelledSpotInClass(site: $site, input: $input) {\n          __typename\n          ... on Error {\n            code\n          }\n          ... on PositionAlreadyTakenError {\n            code\n          }\n          ... on RejectLateCancelledSpotInClassSuccess {\n            success\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query currentUserEnrollmentsPaginated(\n        $site: SiteEnum!\n        $params: CurrentUserEnrollmentsParams\n        $pagination: PaginationInput\n      ) {\n        currentUserEnrollmentsPaginated(site: $site, params: $params, pagination: $pagination) {\n          enrollments {\n            enrollmentInfo {\n              id\n              enrollmentStatus\n              enrollmentDateTime\n              enrollmentDateTimeWithNoTimeZone\n              ... on EnrollmentInfo {\n                spotNumber\n              }\n              ... on WaitlistEntry {\n                canBeTurnedIntoEnrollment\n              }\n            }\n            class {\n              id\n              name\n              description\n              instructorName\n              start\n              startWithNoTimeZone\n              duration\n              waitListAvailable\n              showAsDisabled\n            }\n          }\n          total\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserEnrollmentsPaginated(\n        $site: SiteEnum!\n        $params: CurrentUserEnrollmentsParams\n        $pagination: PaginationInput\n      ) {\n        currentUserEnrollmentsPaginated(site: $site, params: $params, pagination: $pagination) {\n          enrollments {\n            enrollmentInfo {\n              id\n              enrollmentStatus\n              enrollmentDateTime\n              enrollmentDateTimeWithNoTimeZone\n              ... on EnrollmentInfo {\n                spotNumber\n              }\n              ... on WaitlistEntry {\n                canBeTurnedIntoEnrollment\n              }\n            }\n            class {\n              id\n              name\n              description\n              instructorName\n              start\n              startWithNoTimeZone\n              duration\n              waitListAvailable\n              showAsDisabled\n            }\n          }\n          total\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query currentUserWorkoutStatsPaginated($site: SiteEnum!, $pagination: PaginationInput) {\n        currentUserWorkoutStatsPaginated(site: $site, pagination: $pagination) {\n          classStats {\n            enrollment {\n              enrollmentInfo {\n                id\n                ... on EnrollmentInfo {\n                  spotNumber\n                }\n              }\n              class {\n                name\n                start\n                duration\n              }\n            }\n            totalEnergy\n          }\n          total\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserWorkoutStatsPaginated($site: SiteEnum!, $pagination: PaginationInput) {\n        currentUserWorkoutStatsPaginated(site: $site, pagination: $pagination) {\n          classStats {\n            enrollment {\n              enrollmentInfo {\n                id\n                ... on EnrollmentInfo {\n                  spotNumber\n                }\n              }\n              class {\n                name\n                start\n                duration\n              }\n            }\n            totalEnergy\n          }\n          total\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query currentUserPurchasesPaginated($site: SiteEnum!, $pagination: PaginationInput) {\n        currentUserPurchasesPaginated(site: $site, pagination: $pagination) {\n          purchases {\n            packageName\n            allowanceObtained\n            allowanceRemaining\n            paymentDateTime\n            activationDateTime\n            expirationDateTime\n            current\n          }\n          total\n        }\n      }\n    '
): (typeof documents)['\n      query currentUserPurchasesPaginated($site: SiteEnum!, $pagination: PaginationInput) {\n        currentUserPurchasesPaginated(site: $site, pagination: $pagination) {\n          purchases {\n            packageName\n            allowanceObtained\n            allowanceRemaining\n            paymentDateTime\n            activationDateTime\n            expirationDateTime\n            current\n          }\n          total\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n        query currentUserPhoneNumber {\n          currentUser {\n            phone\n          }\n        }\n      '
): (typeof documents)['\n        query currentUserPhoneNumber {\n          currentUser {\n            phone\n          }\n        }\n      ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation requestSMSValidation($input: RequestSMSValidationInput!) {\n        requestSMSValidation(input: $input) {\n          ... on MobilePhoneAlreadyVerifiedError {\n            code\n          }\n          ... on SuccessfulRequestSMSValidation {\n            success\n          }\n          ... on MobilePhoneNotValidError {\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation requestSMSValidation($input: RequestSMSValidationInput!) {\n        requestSMSValidation(input: $input) {\n          ... on MobilePhoneAlreadyVerifiedError {\n            code\n          }\n          ... on SuccessfulRequestSMSValidation {\n            success\n          }\n          ... on MobilePhoneNotValidError {\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n        query isSMSValidationCodeValid($smsCode: String!) {\n          isSMSValidationCodeValid(smsCode: $smsCode) {\n            ... on SMSCodeValidatedSuccessfully {\n              success\n            }\n            ... on RequestSMSValidationNeededError {\n              code\n            }\n            ... on SMSValidationCodeError {\n              code\n            }\n            ... on MobilePhoneAlreadyVerifiedError {\n              code\n            }\n          }\n        }\n      '
): (typeof documents)['\n        query isSMSValidationCodeValid($smsCode: String!) {\n          isSMSValidationCodeValid(smsCode: $smsCode) {\n            ... on SMSCodeValidatedSuccessfully {\n              success\n            }\n            ... on RequestSMSValidationNeededError {\n              code\n            }\n            ... on SMSValidationCodeError {\n              code\n            }\n            ... on MobilePhoneAlreadyVerifiedError {\n              code\n            }\n          }\n        }\n      ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n        query availableSites {\n          availableSites {\n            name\n            code\n          }\n        }\n      '
): (typeof documents)['\n        query availableSites {\n          availableSites {\n            name\n            code\n          }\n        }\n      ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n        query products($site: SiteEnum!, $input: ProductsInput) {\n          products(site: $site, input: $input) {\n            id\n            title\n            subtitle\n            currency\n            buttonText\n            price\n            alertBeforePurchasing {\n              title\n              description\n            }\n            ... on ClassPackageProduct {\n              type\n            }\n          }\n        }\n      '
): (typeof documents)['\n        query products($site: SiteEnum!, $input: ProductsInput) {\n          products(site: $site, input: $input) {\n            id\n            title\n            subtitle\n            currency\n            buttonText\n            price\n            alertBeforePurchasing {\n              title\n              description\n            }\n            ... on ClassPackageProduct {\n              type\n            }\n          }\n        }\n      ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n        query currentUserShoppingCart($site: SiteEnum!) {\n          currentUser {\n            shoppingCart(site: $site) {\n              id\n              total\n              currency\n              subTotal\n              giftCardCode\n              discountCode\n              items {\n                id\n                quantity\n                subtotal\n                product {\n                  currency\n                  price\n                  buttonText\n                  title\n                  id\n                }\n              }\n            }\n          }\n        }\n      '
): (typeof documents)['\n        query currentUserShoppingCart($site: SiteEnum!) {\n          currentUser {\n            shoppingCart(site: $site) {\n              id\n              total\n              currency\n              subTotal\n              giftCardCode\n              discountCode\n              items {\n                id\n                quantity\n                subtotal\n                product {\n                  currency\n                  price\n                  buttonText\n                  title\n                  id\n                }\n              }\n            }\n          }\n        }\n      ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation addItemToShoppingCart($site: SiteEnum!, $input: ItemToShoppingCartInput) {\n        addItemToShoppingCart(site: $site, input: $input) {\n          __typename\n          ... on ShoppingCart {\n            id\n            total\n            currency\n            subTotal\n            giftCardCode\n            discountCode\n            items {\n              id\n              quantity\n              subtotal\n              product {\n                alertBeforePurchasing {\n                  title\n                  description\n                }\n                currency\n                price\n                buttonText\n                title\n                id\n              }\n            }\n          }\n          ... on ProductNotFound {\n            code\n          }\n          ... on ShoppingCartNotFound {\n            code\n          }\n          ... on ShoppingCartIsEmpty {\n            code\n          }\n          ... on ShoppingCartItemNotFound {\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation addItemToShoppingCart($site: SiteEnum!, $input: ItemToShoppingCartInput) {\n        addItemToShoppingCart(site: $site, input: $input) {\n          __typename\n          ... on ShoppingCart {\n            id\n            total\n            currency\n            subTotal\n            giftCardCode\n            discountCode\n            items {\n              id\n              quantity\n              subtotal\n              product {\n                alertBeforePurchasing {\n                  title\n                  description\n                }\n                currency\n                price\n                buttonText\n                title\n                id\n              }\n            }\n          }\n          ... on ProductNotFound {\n            code\n          }\n          ... on ShoppingCartNotFound {\n            code\n          }\n          ... on ShoppingCartIsEmpty {\n            code\n          }\n          ... on ShoppingCartItemNotFound {\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation RemoveItemFromShoppingCart($site: SiteEnum!, $shoppingCartItemId: ID!) {\n        removeItemFromShoppingCart(site: $site, shoppingCartItemId: $shoppingCartItemId) {\n          __typename\n          ... on ShoppingCart {\n            id\n            total\n            currency\n            subTotal\n            giftCardCode\n            discountCode\n            items {\n              id\n              quantity\n              subtotal\n              product {\n                alertBeforePurchasing {\n                  title\n                  description\n                }\n                currency\n                price\n                buttonText\n                title\n                id\n              }\n            }\n          }\n          ... on ProductNotFound {\n            code\n          }\n          ... on ShoppingCartNotFound {\n            code\n          }\n          ... on ShoppingCartIsEmpty {\n            code\n          }\n          ... on ShoppingCartItemNotFound {\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation RemoveItemFromShoppingCart($site: SiteEnum!, $shoppingCartItemId: ID!) {\n        removeItemFromShoppingCart(site: $site, shoppingCartItemId: $shoppingCartItemId) {\n          __typename\n          ... on ShoppingCart {\n            id\n            total\n            currency\n            subTotal\n            giftCardCode\n            discountCode\n            items {\n              id\n              quantity\n              subtotal\n              product {\n                alertBeforePurchasing {\n                  title\n                  description\n                }\n                currency\n                price\n                buttonText\n                title\n                id\n              }\n            }\n          }\n          ... on ProductNotFound {\n            code\n          }\n          ... on ShoppingCartNotFound {\n            code\n          }\n          ... on ShoppingCartIsEmpty {\n            code\n          }\n          ... on ShoppingCartItemNotFound {\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation UpdateItemInShoppingCart($site: SiteEnum!, $input: ItemToShoppingCartInput) {\n        updateItemInShoppingCart(site: $site, input: $input) {\n          ... on ShoppingCart {\n            id\n            total\n            currency\n            subTotal\n            giftCardCode\n            discountCode\n            items {\n              id\n              quantity\n              subtotal\n              product {\n                alertBeforePurchasing {\n                  title\n                  description\n                }\n                currency\n                price\n                buttonText\n                title\n                id\n              }\n            }\n          }\n          ... on ProductNotFound {\n            code\n          }\n          ... on ShoppingCartNotFound {\n            code\n          }\n          ... on ShoppingCartIsEmpty {\n            code\n          }\n          ... on ShoppingCartItemNotFound {\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      mutation UpdateItemInShoppingCart($site: SiteEnum!, $input: ItemToShoppingCartInput) {\n        updateItemInShoppingCart(site: $site, input: $input) {\n          ... on ShoppingCart {\n            id\n            total\n            currency\n            subTotal\n            giftCardCode\n            discountCode\n            items {\n              id\n              quantity\n              subtotal\n              product {\n                alertBeforePurchasing {\n                  title\n                  description\n                }\n                currency\n                price\n                buttonText\n                title\n                id\n              }\n            }\n          }\n          ... on ProductNotFound {\n            code\n          }\n          ... on ShoppingCartNotFound {\n            code\n          }\n          ... on ShoppingCartIsEmpty {\n            code\n          }\n          ... on ShoppingCartItemNotFound {\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query CalculateTotalForShoppingCart($site: SiteEnum!) {\n        calculateTotalForShoppingCart(site: $site) {\n          ... on ShoppingCart {\n            id\n            total\n            currency\n            subTotal\n            giftCardCode\n            discountCode\n            items {\n              id\n              quantity\n              subtotal\n              product {\n                alertBeforePurchasing {\n                  title\n                  description\n                }\n                currency\n                price\n                buttonText\n                title\n                id\n              }\n            }\n          }\n          ... on ProductNotFound {\n            code\n          }\n          ... on ShoppingCartNotFound {\n            code\n          }\n          ... on ShoppingCartIsEmpty {\n            code\n          }\n          ... on ShoppingCartItemNotFound {\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query CalculateTotalForShoppingCart($site: SiteEnum!) {\n        calculateTotalForShoppingCart(site: $site) {\n          ... on ShoppingCart {\n            id\n            total\n            currency\n            subTotal\n            giftCardCode\n            discountCode\n            items {\n              id\n              quantity\n              subtotal\n              product {\n                alertBeforePurchasing {\n                  title\n                  description\n                }\n                currency\n                price\n                buttonText\n                title\n                id\n              }\n            }\n          }\n          ... on ProductNotFound {\n            code\n          }\n          ... on ShoppingCartNotFound {\n            code\n          }\n          ... on ShoppingCartIsEmpty {\n            code\n          }\n          ... on ShoppingCartItemNotFound {\n            code\n          }\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation PayfortForm($site: SiteEnum!, $input: PayfortFormInput!) {\n        payfortForm(site: $site, input: $input) {\n          htmlForm\n        }\n      }\n    '
): (typeof documents)['\n      mutation PayfortForm($site: SiteEnum!, $input: PayfortFormInput!) {\n        payfortForm(site: $site, input: $input) {\n          htmlForm\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      mutation GenerateMerchantReference($site: SiteEnum!) {\n        generateMerchantReference(site: $site)\n      }\n    '
): (typeof documents)['\n      mutation GenerateMerchantReference($site: SiteEnum!) {\n        generateMerchantReference(site: $site)\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query CurrentUserSites {\n        currentUser {\n          siteUsers {\n            site\n          }\n        }\n        availableSites {\n          name\n          code\n        }\n      }\n    '
): (typeof documents)['\n      query CurrentUserSites {\n        currentUser {\n          siteUsers {\n            site\n          }\n        }\n        availableSites {\n          name\n          code\n        }\n      }\n    ']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n      query PaymentTransactionStatus($input: PaymentTransactionStatusInput) {\n        paymentTransactionStatus(input: $input) {\n          ... on PaymentTransactionStatus {\n            status\n          }\n          ... on TemporalTransactionNotFound {\n            code\n          }\n        }\n      }\n    '
): (typeof documents)['\n      query PaymentTransactionStatus($input: PaymentTransactionStatusInput) {\n        paymentTransactionStatus(input: $input) {\n          ... on PaymentTransactionStatus {\n            status\n          }\n          ... on TemporalTransactionNotFound {\n            code\n          }\n        }\n      }\n    ']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
