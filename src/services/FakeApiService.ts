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
  SiteEnum,
  SiteSetting,
  UpdateCurrentUserPasswordInput,
  User,
  UserInClassRanking,
  UserInput,
  UserInRankingParams
} from '@/gql/graphql'
import type { CustomCalendarClasses } from '@/model/CustomCalendarClasses'
import type { IsSmsValidationCodeValidResponse } from '@/modules/buy_packages/models/is-sms-validation-code-valid-response'
import type { SmsValidationResponse } from '@/modules/buy_packages/models/sms-validation-response'
import type { PaymentTransactionResponse } from '@/modules/shop/models/payment-transaction-response'
import type { IApiService } from './IApiService'
import type { Product } from '@/modules/shop/models/Product'
import type { ShoppingCart as ShoppingCartModel } from '@/modules/shop/models/ShoppingCart'
import type { AppProductType } from '@/modules/shop/models/types'
import type { Promise } from 'cypress/types/cy-bluebird'

export class FakeApiService implements IApiService {
  getSiteSettings(site: SiteEnum): Promise<SiteSetting | null> {
    throw new Error('Method not implemented.')
  }

  getMyself(): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  currentUserSingleWorkoutStat(enrollmentId: string): Promise<ClassStat> {
    throw new Error('Method not implemented.')
  }

  getCurrentUserEnrollmentInClass(classId: string): Promise<EnrollmentInfo | null> {
    throw new Error('Method not implemented.')
  }

  getCountries(): Promise<Country[]> {
    throw new Error('Method not implemented.')
  }

  getCountry(countryCode: string): Promise<Country | null> {
    throw new Error('Method not implemented.')
  }

  getCalendarClasses(site: SiteEnum, startDate: string, endDate: string): Promise<Class[]> {
    throw new Error('Method not implemented.')
  }

  getCustomCalendarClasses(
    site: SiteEnum,
    startDate: string,
    endDate: string
  ): Promise<CustomCalendarClasses> {
    throw new Error('Method not implemented.')
  }

  getClassInfo(site: SiteEnum, id: string): Promise<ClassInfo | null> {
    throw new Error('Method not implemented.')
  }

  registerUser(site: SiteEnum, input: RegisterUserInput): Promise<string> {
    throw new Error('Method not implemented.')
  }

  updateCurrentUser(input: UserInput): Promise<string> {
    throw new Error('Method not implemented.')
  }

  bookClass(site: SiteEnum, input: BookClassInput): Promise<string> {
    throw new Error('Method not implemented.')
  }

  cancelCurrentUserEnrollment(site: SiteEnum, input: CancelEnrollmentInput): Promise<string> {
    throw new Error('Method not implemented.')
  }

  removeCurrentUserFromWaitlist(
    site: SiteEnum,
    input: RemoveCurrentUserFromWaitlistInput
  ): Promise<any> {
    throw new Error('Method not implemented.')
  }

  removeUserFromClass(enrollmentId: string, lateCancel?: boolean): Promise<string> {
    throw new Error('Method not implemented.')
  }

  editClass(input: EditClassInput): Promise<EditClassResultUnion> {
    throw new Error('Method not implemented.')
  }

  updateCurrentUserPassword(
    site: SiteEnum,
    input: UpdateCurrentUserPasswordInput
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }

  editCurrentUserEnrollment(
    site: SiteEnum,
    enrollmentId: string,
    newSpotNumber: number
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }

  requestPasswordLink(email: string): Promise<ResetPasswordLinkResultUnion | null> {
    throw new Error('Method not implemented.')
  }

  resetPasswordForCurrentUser(
    password: string,
    repeatedPassword: string
  ): Promise<ResetPasswordForCurrentUserUnion | null> {
    throw new Error('Method not implemented.')
  }

  currentUserDoesExistInSite(site: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  createCurrentUserInSite(
    fromSite: string,
    toSite: string
  ): Promise<CreateCurrentUserInSiteUnion | null> {
    throw new Error('Method not implemented.')
  }

  removeUserFromWaitlist(waitlistEntryId: string): Promise<RemoveUserFromWaitlistUnion> {
    throw new Error('Method not implemented.')
  }

  editEnrollment(site: SiteEnum, input: EditEnrollmentInput): Promise<EditEnrollmentResultUnion> {
    throw new Error('Method not implemented.')
  }

  getCurrentUserSites(): Promise<SiteEnum[]> {
    throw new Error('Method not implemented.')
  }

  getCurrentUserRankingInClass(
    site: SiteEnum,
    params: UserInRankingParams
  ): Promise<UserInClassRanking> {
    throw new Error('Method not implemented.')
  }

  acceptLateCancelledSpotInClass(
    site: SiteEnum,
    waitlistEntryId: string
  ): Promise<AcceptLateCancelledSpotInClassResultUnion> {
    throw new Error('Method not implemented.')
  }

  rejectLateCancelledSpotInClass(
    site: SiteEnum,
    waitlistEntryId: string
  ): Promise<RejectLateBookingResultUnion> {
    throw new Error('Method not implemented.')
  }

  currentUserEnrollmentsPaginated(
    site: SiteEnum,
    params: CurrentUserEnrollmentsParams,
    pagination: PaginationInput
  ): Promise<PaginatedEnrollments> {
    throw new Error('Method not implemented.')
  }

  currentUserWorkoutStatsPaginated(
    site: SiteEnum,
    pagination: PaginationInput
  ): Promise<PaginatedClassStats> {
    throw new Error('Method not implemented.')
  }

  currentUserPurchasesPaginated(
    site: SiteEnum,
    pagination: PaginationInput
  ): Promise<PaginatedPurchases> {
    throw new Error('Method not implemented.')
  }

  currentUserPhoneNumber(): Promise<string> {
    throw new Error('Method not implemented.')
  }

  requestSMSValidation(countryCode: string, mobilePhone: string): Promise<SmsValidationResponse> {
    throw new Error('Method not implemented.')
  }

  isSMSValidationCodeValid(smsCode: string): Promise<IsSmsValidationCodeValidResponse> {
    throw new Error('Method not implemented.')
  }

  availableSites(): Promise<Site[]> {
    throw new Error('Method not implemented.')
  }

  getProducts(site: SiteEnum, options?: { type?: AppProductType }): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }

  addItemToShoppingCart(
    site: SiteEnum,
    sellableProductId: string,
    quantity: number
  ): Promise<ShoppingCartModel> {
    throw new Error('Method not implemented.')
  }

  removeItemFromShoppingCart(
    site: SiteEnum,
    shoppingCartItemId: string
  ): Promise<ShoppingCartModel> {
    throw new Error('Method not implemented.')
  }

  updateItemInShoppingCart(
    site: SiteEnum,
    sellableProductId: string,
    quantity: number
  ): Promise<ShoppingCartModel> {
    throw new Error('Method not implemented.')
  }

  addGiftCardCodeToShoppingCart(giftCard: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  addDiscountCodeToShoppingCart(discountCode: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  calculateTotalForShoppingCart(site: SiteEnum): Promise<ShoppingCartModel> {
    throw new Error('Method not implemented.')
  }

  getPayfortForm(
    site: SiteEnum,
    savePaymentCard: boolean,
    deviceFingerprint: string,
    merchantReference: string
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }

  generateMerchantReference(site: SiteEnum): Promise<string> {
    throw new Error('Method not implemented.')
  }

  getCurrentUserSitesWithNames(): Promise<Site[]> {
    throw new Error('Method not implemented.')
  }

  checkTransactionStatus(merchantReference: string): Promise<PaymentTransactionResponse> {
    throw new Error('Method not implemented.')
  }

  getShoppingCart(site: SiteEnum): Promise<ShoppingCartModel | null> {
    throw new Error('Method not implemented.')
  }
}
