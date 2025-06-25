import type {
  AcceptLateCancelledSpotInClassResultUnion,
  BookClassInput,
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
  EnrollmentInfo,
  PaginatedClassStats,
  PaginatedEnrollments,
  PaginatedPurchases,
  PaginationInput,
  RegisterUserInput,
  RejectLateBookingResultUnion,
  RemoveCurrentUserFromWaitlistInput,
  RemoveUserFromWaitlistUnion,
  ResetPasswordForCurrentUserUnion,
  ResetPasswordLinkResultUnion,
  Site,
  SiteSetting,
  UpdateCurrentUserPasswordInput,
  User,
  UserInClassRanking,
  UserInput,
  UserInRankingParams
} from '@/gql/graphql'
import type { CustomCalendarClasses } from '@/model/CustomCalendarClasses'
import type { SmsValidationResponse } from '@/modules/buy_packages/models/sms-validation-response'
import type { IsSmsValidationCodeValidResponse } from '@/modules/buy_packages/models/is-sms-validation-code-valid-response'
import type { PaymentTransactionResponse } from '@/modules/shop/models/payment-transaction-response'
import type { Product } from '@/modules/shop/models/Product'
import type { AppProductType } from '@/modules/shop/models/types'
import type { SiteEnum } from '@/modules/shared/interfaces/site.enum'
import type { ShoppingCart as ShoppingCartModel } from '@/modules/shop/models/ShoppingCart'

/**
 * Interface defining the contract for the API service.
 * It provides a set of methods to interact with the GraphQL backend,
 * handling both authenticated and anonymous clients.
 */
export interface IApiService {
  /**
   * Gets the settings for a specific site, such as the current date, time, and timezone.
   * @param site The enum of the site to query.
   * @returns A promise that resolves with the site settings or null if an error occurs.
   */
  getSiteSettings(site: SiteEnum): Promise<SiteSetting | null>

  /**
   * Gets the profile information of the currently authenticated user.
   * @returns A promise that resolves with the User object or null if an error occurs.
   */
  getMyself(): Promise<User | null>

  /**
   * Gets the statistics for a specific workout for the current user.
   * @param enrollmentId The ID of the workout enrollment.
   * @returns A promise that resolves with the class statistics.
   */
  currentUserSingleWorkoutStat(enrollmentId: string): Promise<ClassStat>

  /**
   * Gets the current user's enrollment information for a specific class.
   * @param classId The ID of the class.
   * @returns A promise that resolves with the enrollment information, or null if not enrolled or an error occurs.
   */
  getCurrentUserEnrollmentInClass(classId: string): Promise<EnrollmentInfo | null>

  /**
   * Gets a list of all available countries.
   * @returns A promise that resolves with an array of countries.
   */
  getCountries(): Promise<Country[]>

  /**
   * Gets detailed information for a country, including its states/provinces.
   * @param countryCode The code of the country.
   * @returns A promise that resolves with the Country object or null if not found.
   */
  getCountry(countryCode: string): Promise<Country | null>

  /**
   * Gets the available classes in a calendar for a date range.
   * @param site The site for which to get the classes.
   * @param startDate The start date of the range.
   * @param endDate The end date of the range.
   * @returns A promise that resolves with an array of classes.
   */
  getCalendarClasses(site: SiteEnum, startDate: string, endDate: string): Promise<Class[]>

  /**
   * Gets combined data for the calendar: classes, enrollments, and site settings.
   * @param site The site for which to get the data.
   * @param startDate The start date of the range.
   * @param endDate The end date of the range.
   * @returns A promise that resolves with a CustomCalendarClasses object.
   */
  getCustomCalendarClasses(
    site: SiteEnum,
    startDate: string,
    endDate: string
  ): Promise<CustomCalendarClasses>

  /**
   * Gets detailed information for a class, including the room layout and used spots.
   * @param site The site where the class is held.
   * @param id The ID of the class.
   * @returns A promise that resolves with the class information or null if an error occurs.
   */
  getClassInfo(site: SiteEnum, id: string): Promise<ClassInfo | null>

  /**
   * Registers a new user on a specific site.
   * @param site The site where the user will be registered.
   * @param input The user's registration data.
   * @returns A promise that resolves with a string indicating the result of the operation.
   */
  registerUser(site: SiteEnum, input: RegisterUserInput): Promise<string>

  /**
   * Updates the profile of the currently authenticated user.
   * @param input The user data to update.
   * @returns A promise that resolves with a string indicating the result.
   */
  updateCurrentUser(input: UserInput): Promise<string>

  /**
   * Books the current user into a class.
   * @param site The site of the class.
   * @param input Data for the booking (class ID, spot, etc.).
   * @returns A promise that resolves with a string representing the booking result.
   */
  bookClass(site: SiteEnum, input: BookClassInput): Promise<string>

  /**
   * Cancels an enrollment for the current user in a class.
   * @param site The site of the class.
   * @param input Data for the cancellation (enrollment ID).
   * @returns A promise that resolves with a string representing the cancellation result.
   */
  cancelCurrentUserEnrollment(site: SiteEnum, input: CancelEnrollmentInput): Promise<string>

  /**
   * Removes the current user from the waitlist of a class.
   * @param site The site of the class.
   * @param input Data for the removal (class ID).
   * @returns A promise that resolves with the result of the operation.
   */
  removeCurrentUserFromWaitlist(
    site: SiteEnum,
    input: RemoveCurrentUserFromWaitlistInput
  ): Promise<any> // The original return type is `any`, kept for consistency.

  /**
   * Removes a user from a class (admin action).
   * @param enrollmentId The ID of the enrollment to remove.
   * @param lateCancel Optional. Indicates if it's a late cancellation.
   * @returns A promise that resolves with a string indicating the result.
   */
  removeUserFromClass(enrollmentId: string, lateCancel?: boolean): Promise<string>

  /**
   * Edits the details of an existing class (admin action).
   * @param input The new class data.
   * @returns A promise that resolves with the result of the edit.
   */
  editClass(input: EditClassInput): Promise<EditClassResultUnion>

  /**
   * Updates the current user's password.
   * @param site The user's site.
   * @param input The current and new passwords.
   * @returns A promise that resolves with a string indicating the result.
   */
  updateCurrentUserPassword(site: SiteEnum, input: UpdateCurrentUserPasswordInput): Promise<string>

  /**
   * Edits the current user's enrollment, for example, to change spots.
   * @param site The site of the class.
   * @param enrollmentId The ID of the enrollment to edit.
   * @param newSpotNumber The new spot number.
   * @returns A promise that resolves with a string indicating the result.
   */
  editCurrentUserEnrollment(
    site: SiteEnum,
    enrollmentId: string,
    newSpotNumber: number
  ): Promise<string>

  /**
   * Requests a password reset link via email.
   * @param email The user's email.
   * @returns A promise that resolves with the result of the request or null.
   */
  requestPasswordLink(email: string): Promise<ResetPasswordLinkResultUnion | null>

  /**
   * Resets the password for the current user.
   * @param password The new password.
   * @param repeatedPassword The confirmation of the new password.
   * @returns A promise that resolves with the result of the operation or null.
   */
  resetPasswordForCurrentUser(
    password: string,
    repeatedPassword: string
  ): Promise<ResetPasswordForCurrentUserUnion | null>

  /**
   * Checks if the current user exists in a specific site.
   * @param site The site code.
   * @returns A promise that resolves with `true` if the user exists, `false` otherwise.
   */
  currentUserDoesExistInSite(site: string): Promise<boolean>

  /**
   * Creates an account for the current user in a new site, based on their profile from another site.
   * @param fromSite The source site.
   * @param toSite The destination site.
   * @returns A promise that resolves with the result of the creation or null.
   */
  createCurrentUserInSite(
    fromSite: string,
    toSite: string
  ): Promise<CreateCurrentUserInSiteUnion | null>

  /**
   * Removes a user from a waitlist (admin action).
   * @param waitlistEntryId The ID of the waitlist entry.
   * @returns A promise that resolves with the result of the removal.
   */
  removeUserFromWaitlist(waitlistEntryId: string): Promise<RemoveUserFromWaitlistUnion>

  /**
   * Edits an enrollment (admin action).
   * @param site The site of the class.
   * @param input The enrollment data to modify.
   * @returns A promise that resolves with the result of the edit.
   */
  editEnrollment(site: SiteEnum, input: EditEnrollmentInput): Promise<EditEnrollmentResultUnion>

  /**
   * Gets the site codes where the current user is registered.
   * @returns A promise that resolves with an array of site enums.
   */
  getCurrentUserSites(): Promise<SiteEnum[]>

  /**
   * Gets the current user's ranking in a specific class.
   * @param site The site of the class.
   * @param params Parameters to filter the ranking.
   * @returns A promise that resolves with the user's ranking object.
   */
  getCurrentUserRankingInClass(
    site: SiteEnum,
    params: UserInRankingParams
  ): Promise<UserInClassRanking>

  /**
   * Accepts a spot in a class that became available due to a late cancellation.
   * @param site The site of the class.
   * @param waitlistEntryId The ID of the waitlist entry.
   * @returns A promise that resolves with the result of the acceptance.
   */
  acceptLateCancelledSpotInClass(
    site: SiteEnum,
    waitlistEntryId: string
  ): Promise<AcceptLateCancelledSpotInClassResultUnion>

  /**
   * Rejects a spot in a class that became available due to a late cancellation.
   * @param site The site of the class.
   * @param waitlistEntryId The ID of the waitlist entry.
   * @returns A promise that resolves with the result of the rejection.
   */
  rejectLateCancelledSpotInClass(
    site: SiteEnum,
    waitlistEntryId: string
  ): Promise<RejectLateBookingResultUnion>

  /**
   * Gets a paginated list of the current user's enrollments.
   * @param site The site to query.
   * @param params Filters for the enrollments.
   * @param pagination Pagination information.
   * @returns A promise that resolves with the paginated enrollments.
   */
  currentUserEnrollmentsPaginated(
    site: SiteEnum,
    params: CurrentUserEnrollmentsParams,
    pagination: PaginationInput
  ): Promise<PaginatedEnrollments>

  /**
   * Gets a paginated list of the current user's workout statistics.
   * @param site The site to query.
   * @param pagination Pagination information.
   * @returns A promise that resolves with the paginated statistics.
   */
  currentUserWorkoutStatsPaginated(
    site: SiteEnum,
    pagination: PaginationInput
  ): Promise<PaginatedClassStats>

  /**
   * Gets a paginated list of the current user's purchases.
   * @param site The site to query.
   * @param pagination Pagination information.
   * @returns A promise that resolves with the paginated purchases.
   */
  currentUserPurchasesPaginated(
    site: SiteEnum,
    pagination: PaginationInput
  ): Promise<PaginatedPurchases>

  /**
   * Gets the current user's phone number.
   * @returns A promise that resolves with the phone number.
   */
  currentUserPhoneNumber(): Promise<string>

  /**
   * Requests an SMS validation code.
   * @param countryCode The country code.
   * @param mobilePhone The mobile phone number.
   * @returns A promise that resolves with the SMS request response.
   */
  requestSMSValidation(countryCode: string, mobilePhone: string): Promise<SmsValidationResponse>

  /**
   * Validates an SMS code entered by the user.
   * @param smsCode The code to validate.
   * @returns A promise that resolves with the validation response.
   */
  isSMSValidationCodeValid(smsCode: string): Promise<IsSmsValidationCodeValidResponse>

  /**
   * Gets a list of all available sites on the platform.
   * @returns A promise that resolves with an array of sites.
   */
  availableSites(): Promise<Site[]>

  /**
   * Fetches sellable products for a given site from the API and transforms them
   * into rich domain models.
   *
   * @param site The site enum to fetch products for.
   * @param options Optional filters to apply to the product query.
   * @param options.type Filters products by a specific type (e.g., ClassPackage or GiftCard).
   * @returns A promise that resolves to an array of `Product` domain models.
   *          Throws an `ApiError` if the fetch fails.
   */
  getProducts(site: SiteEnum, options?: { type?: AppProductType }): Promise<Product[]>

  /**
   * Adds an item to the user's shopping cart.
   * On success, it returns a new instance of the domain ShoppingCartModel.
   * On failure, it throws an ApiError for business logic errors or a generic Error for network issues.
   *
   * @param site The site where the purchase is being made.
   * @param sellableProductId The ID of the product to add.
   * @param quantity The number of items to add.
   * @returns A Promise that resolves with the updated ShoppingCartModel instance.
   */
  addItemToShoppingCart(
    site: SiteEnum,
    sellableProductId: string,
    quantity: number
  ): Promise<ShoppingCartModel>

  /**
   * Removes an item from the user's shopping cart.
   * On success, it returns the updated ShoppingCartModel instance.
   * On failure, it throws an ApiError for business logic errors or a generic Error for network issues.
   *
   * @param site The site where the cart exists.
   * @param shoppingCartItemId The ID of the cart item to remove.
   * @returns A Promise that resolves with the updated ShoppingCartModel instance.
   */
  removeItemFromShoppingCart(site: SiteEnum, shoppingCartItemId: string): Promise<ShoppingCartModel>

  /**
   * Updates the quantity of an item in the user's shopping cart.
   * On success, it returns the updated ShoppingCartModel instance.
   * On failure, it throws an ApiError for business logic errors or a generic Error for network issues.
   *
   * @param site The site where the cart exists.
   * @param sellableProductId The ID of the product to update.
   * @param quantity The new quantity for the item.
   * @returns A Promise that resolves with the updated ShoppingCartModel instance.
   */
  updateItemInShoppingCart(
    site: SiteEnum,
    sellableProductId: string,
    quantity: number
  ): Promise<ShoppingCartModel>

  /**
   * Adds a gift card code to the shopping cart.
   * @param giftCard The gift card code.
   * @returns A promise that resolves with a string (method not implemented).
   */
  addGiftCardCodeToShoppingCart(giftCard: string): Promise<string>

  /**
   * Adds a discount code to the shopping cart.
   * @param discountCode The discount code.
   * @returns A promise that resolves with a boolean (method not implemented).
   */
  addDiscountCodeToShoppingCart(discountCode: string): Promise<boolean>

  /**
   * Recalculates the totals for the user's shopping cart and fetches the updated state.
   * This is typically used after applying discounts or gift cards.
   * On success, it returns the updated ShoppingCartModel instance.
   * On failure, it throws an ApiError for business logic errors or a generic Error for network issues.
   *
   * @param site The site where the cart exists.
   * @returns A Promise that resolves with the updated ShoppingCartModel instance.
   */
  calculateTotalForShoppingCart(site: SiteEnum): Promise<ShoppingCartModel>

  /**
   * Gets the Payfort HTML form to process a payment.
   * @param site The site of the transaction.
   * @param savePaymentCard Whether the card should be saved for future purchases.
   * @param deviceFingerprint A unique device identifier.
   * @param merchantReference A unique merchant reference for the transaction.
   * @returns A promise that resolves with the payment form HTML.
   */
  getPayfortForm(
    site: SiteEnum,
    savePaymentCard: boolean,
    deviceFingerprint: string,
    merchantReference: string
  ): Promise<string>

  /**
   * Generates a unique merchant reference for a transaction.
   * @param site The site of the transaction.
   * @returns A promise that resolves with the merchant reference.
   */
  generateMerchantReference(site: SiteEnum): Promise<string>

  /**
   * Gets the sites where the current user is registered, including their names.
   * @returns A promise that resolves with an array of Site objects.
   */
  getCurrentUserSitesWithNames(): Promise<Site[]>

  /**
   * Queries the status of a payment transaction.
   * @param merchantReference The merchant reference of the transaction.
   * @returns A promise that resolves with the transaction status response.
   */
  paymentTransactionStatus(merchantReference: string): Promise<PaymentTransactionResponse>

  /**
   * Fetches the current user's shopping cart for a specific site.
   *
   * @param site The site for which to fetch the cart.
   * @returns A promise that resolves to a `ShoppingCart` model instance,
   *          or `null` if the user has no cart or an error occurs.
   */
  getShoppingCart(site: SiteEnum): Promise<ShoppingCartModel | null>
}
