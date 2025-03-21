/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** Format: Y-m-d */
  Date: any
  DateTime: any
  DateTimeWithoutTimeZone: any
}

export type AcceptLateCancelledSpotInClassInput = {
  waitlistEntryId: Scalars['ID']
}

export type AcceptLateCancelledSpotInClassResultUnion =
  | AcceptLateCancelledSpotInClassSuccess
  | ClassIsFullError
  | ClientIsAlreadyBookedError
  | ClientIsOutsideSchedulingWindowError
  | PaymentRequiredError
  | UnknownError

export type AcceptLateCancelledSpotInClassSuccess = {
  __typename: 'AcceptLateCancelledSpotInClassSuccess'
  success: Scalars['Boolean']
}

export type AddedToWaitlistSuccess = {
  __typename: 'AddedToWaitlistSuccess'
  status: Scalars['Boolean']
}

export type AdminUser = {
  __typename: 'AdminUser'
  email: Scalars['String']
  favoriteSite: Site
  id: Scalars['ID']
  linkedInstructors?: Maybe<Array<Instructor>>
  linkedSites?: Maybe<Array<Site>>
  roles?: Maybe<Array<Scalars['String']>>
  showCancelledClasses: Scalars['Boolean']
  username: Scalars['String']
}

export type AdminUserDataInput = {
  email: Scalars['String']
  favoriteSite?: InputMaybe<SiteEnum>
  linkedInstructorIds?: InputMaybe<Array<Scalars['ID']>>
  linkedSiteCodes?: InputMaybe<Array<SiteEnum>>
  role: Scalars['String']
  username: Scalars['String']
}

export type AdminUserResultUnion = AdminUser | EmailAlreadyUsedError | UsernameAlreadyUsedError

export type BookClassInput = {
  classId: Scalars['ID']
  isWaitlistBooking?: InputMaybe<Scalars['Boolean']>
  spotNumber?: InputMaybe<Scalars['Int']>
}

export type BookClassResultUnion =
  | AddedToWaitlistSuccess
  | BookClassSuccess
  | BookedButInOtherSpotError
  | BookingOverlapsAnotherOneError
  | ClassIsFullError
  | ClientIsAlreadyBookedError
  | ClientIsAlreadyOnWaitlistError
  | ClientIsOutsideSchedulingWindowError
  | PaymentRequiredError
  | SpotAlreadyReservedError
  | SpotIsDisabledError
  | UnknownError
  | WaitlistFullError

export type BookClassSuccess = {
  __typename: 'BookClassSuccess'
  status: Scalars['Boolean']
}

export type BookUserIntoClassInput = {
  classId: Scalars['ID']
  isPaymentRequired?: InputMaybe<Scalars['Boolean']>
  isWaitlistBooking?: InputMaybe<Scalars['Boolean']>
  siteUserId: Scalars['ID']
  spotNumber?: InputMaybe<Scalars['Int']>
}

export type BookableSpot = ClassPositionInterface & {
  __typename: 'BookableSpot'
  enabled?: Maybe<Scalars['Boolean']>
  icon: PositionIconEnum
  /** @deprecated isBooked should be moved somewhere else and spotNumber has been moved to the root. */
  spotInfo: SpotInfo
  spotNumber: Scalars['Int']
  x: Scalars['Int']
  y: Scalars['Int']
}

export type BookedButInOtherSpotError = Error & {
  __typename: 'BookedButInOtherSpotError'
  code: Scalars['String']
  givenSpot: Scalars['Int']
  requiredSpot: Scalars['Int']
}

export type BookingOverlapsAnotherOneError = Error & {
  __typename: 'BookingOverlapsAnotherOneError'
  code: Scalars['String']
}

export type BookingWindow = {
  __typename: 'BookingWindow'
  endDateTime: Scalars['DateTime']
  startDateTime: Scalars['DateTime']
}

export type CalendarClassesParams = {
  endDate?: InputMaybe<Scalars['Date']>
  startDate?: InputMaybe<Scalars['Date']>
}

export type CancelEnrollmentInput = {
  enrollmentId: Scalars['ID']
  lateCancel?: InputMaybe<Scalars['Boolean']>
}

export type CancelEnrollmentResultUnion =
  | CancelUserEnrollmentSuccess
  | LateCancellationRequiredError
  | UnknownError

export type CancelUserEnrollmentSuccess = {
  __typename: 'CancelUserEnrollmentSuccess'
  status?: Maybe<Scalars['Boolean']>
}

export type ChallengeDisplay = {
  __typename: 'ChallengeDisplay'
  firstLine?: Maybe<Scalars['String']>
  secondLine?: Maybe<Scalars['String']>
  thirdLine?: Maybe<Scalars['String']>
}

export type ChallengeInterface = {
  challengeDisplay: ChallengeDisplay
  id: Scalars['ID']
}

export type ChartPoint = {
  __typename: 'ChartPoint'
  power?: Maybe<Scalars['Int']>
  rpm?: Maybe<Scalars['Int']>
  time?: Maybe<Scalars['Int']>
}

export type CheckinResultUnion = CheckinSuccess | EnrollmentNotFoundError

export type CheckinSuccess = {
  __typename: 'CheckinSuccess'
  success: Scalars['Boolean']
}

export type CheckinUserInClass = {
  enrollmentId: Scalars['ID']
}

export type CheckoutResultUnion = CheckoutSuccess | EnrollmentNotFoundError

export type CheckoutSuccess = {
  __typename: 'CheckoutSuccess'
  success: Scalars['Boolean']
}

export type CheckoutUserInClass = {
  enrollmentId: Scalars['ID']
}

export type Class = {
  __typename: 'Class'
  bookingWindow: BookingWindow
  description: Scalars['String']
  duration: Scalars['Int']
  hasClassStats: Scalars['Boolean']
  id: Scalars['ID']
  instructorName: Scalars['String']
  isSubstitute: Scalars['Boolean']
  isSynchronizing: Scalars['Boolean']
  maxCapacity: Scalars['Int']
  name: Scalars['String']
  showAsDisabled: Scalars['Boolean']
  start: Scalars['DateTime']
  /** Same as start but without timezone. If start is 2023-11-04T10:15:00+04:00 then this value will be 2023-11-04T10:15:00 */
  startWithNoTimeZone: Scalars['DateTimeWithoutTimeZone']
  totalBooked: Scalars['Int']
  totalUnderMaintenanceSpots: Scalars['Int']
  waitListAvailable: Scalars['Boolean']
}

export type ClassInfo = {
  __typename: 'ClassInfo'
  class: Class
  enrollments: Array<EnrollmentInfoInterface>
  onHoldSpots: Scalars['Int']
  orphanedClassStatsSpots: Array<Scalars['Int']>
  roomLayout?: Maybe<RoomLayout>
  usedSpots?: Maybe<Array<Scalars['Int']>>
}

export type ClassInfoEnrollmentsArgs = {
  status?: InputMaybe<EnrollmentStatusEnum>
}

export type ClassIsFullError = Error & {
  __typename: 'ClassIsFullError'
  code: Scalars['String']
}

export type ClassPackageProduct = SellableProductInterface & {
  __typename: 'ClassPackageProduct'
  alertBeforePurchasing?: Maybe<ProductAlertBeforePurchasing>
  buttonText?: Maybe<Scalars['String']>
  currency: Scalars['String']
  id: Scalars['ID']
  isVisible: Scalars['Boolean']
  price: Scalars['Float']
  subtitle?: Maybe<Scalars['String']>
  title: Scalars['String']
  type?: Maybe<ClassPackageTypeEnum>
}

export enum ClassPackageTypeEnum {
  Membership = 'membership',
  Regular = 'regular',
  Special = 'special',
  Trial = 'trial',
  Vod = 'vod'
}

export type ClassPositionInterface = {
  icon: PositionIconEnum
  x: Scalars['Int']
  y: Scalars['Int']
}

export type ClassSchedule = {
  __typename: 'ClassSchedule'
  capacity: Scalars['Int']
  dayOfWeek: Scalars['String']
  end: Scalars['DateTime']
  endWithNoTimeZone: Scalars['DateTimeWithoutTimeZone']
  id: Scalars['ID']
  instructorName: Scalars['String']
  roomLayout?: Maybe<RoomLayout>
  start: Scalars['DateTime']
  startWithNoTimeZone: Scalars['DateTimeWithoutTimeZone']
  type: Scalars['String']
}

export type ClassStat = {
  __typename: 'ClassStat'
  /** Amount of chart points adjusted to the amount of the requested ones. Values for each points are the average of each interval */
  adjustedChartPoints: Array<ChartPoint>
  averagePower?: Maybe<Scalars['Float']>
  averageRpm?: Maybe<Scalars['Float']>
  calories?: Maybe<Scalars['Float']>
  chartPoints: Array<ChartPoint>
  distance?: Maybe<Scalars['Float']>
  distanceUnit?: Maybe<Scalars['String']>
  enrollment: Enrollment
  highPower?: Maybe<Scalars['Float']>
  highRpm?: Maybe<Scalars['Float']>
  totalEnergy?: Maybe<Scalars['Float']>
}

export type ClassStatAdjustedChartPointsArgs = {
  amountOfPoints?: InputMaybe<Scalars['Int']>
}

/** Error returned when a client is already booked in a class */
export type ClientIsAlreadyBookedError = Error & {
  __typename: 'ClientIsAlreadyBookedError'
  code: Scalars['String']
}

export type ClientIsAlreadyOnWaitlistError = Error & {
  __typename: 'ClientIsAlreadyOnWaitlistError'
  code: Scalars['String']
}

/** Error returned when a client tries to book a class which is not permitted to book any longer. The booking window has passed. */
export type ClientIsOutsideSchedulingWindowError = Error & {
  __typename: 'ClientIsOutsideSchedulingWindowError'
  code: Scalars['String']
}

export type Country = {
  __typename: 'Country'
  code: Scalars['String']
  name: Scalars['String']
  states?: Maybe<Array<Maybe<State>>>
}

export type CreateCurrentUserInSiteSuccess = {
  __typename: 'CreateCurrentUserInSiteSuccess'
  result: Scalars['Boolean']
}

export type CreateCurrentUserInSiteUnion = CreateCurrentUserInSiteSuccess | UserAlreadyExistsError

export type CurrentUserEnrollmentsParams = {
  endDate?: InputMaybe<Scalars['Date']>
  enrollmentType?: InputMaybe<EnrollmentTypeEnum>
  startDate?: InputMaybe<Scalars['Date']>
}

export type DeleteCurrentUserAccountSuccess = {
  __typename: 'DeleteCurrentUserAccountSuccess'
  success: Scalars['Boolean']
}

export type DeleteCurrentUserAccountUnion =
  | DeleteCurrentUserAccountSuccess
  | UserPasswordDoesNotMatchError

export type DeviceTokenInput = {
  deviceToken: Scalars['String']
}

export type DisableEnableSpotInput = {
  classId: Scalars['ID']
  spotNumber?: InputMaybe<Scalars['Int']>
}

export type DisableEnableSpotResult = {
  __typename: 'DisableEnableSpotResult'
  result?: Maybe<Scalars['Boolean']>
}

export type DisableEnableSpotResultUnion = DisableEnableSpotResult | SpotNotFoundError

export type DistanceChallenge = ChallengeInterface & {
  __typename: 'DistanceChallenge'
  challengeDisplay: ChallengeDisplay
  goalInKM: Scalars['Int']
  id: Scalars['ID']
  ranking?: Maybe<DistanceRanking>
}

export type DistanceChallengeRankingPosition = {
  __typename: 'DistanceChallengeRankingPosition'
  totalKm: Scalars['Float']
  userPositionInRanking: UserPositionInRanking
}

export type DistanceRanking = {
  __typename: 'DistanceRanking'
  amountOfUsersInRanking: Scalars['Int']
  rankingPositions: Array<DistanceChallengeRankingPosition>
}

export type EditClassInput = {
  classId: Scalars['ID']
  onHoldSpots?: InputMaybe<Scalars['Int']>
  roomLayoutId?: InputMaybe<Scalars['ID']>
}

export type EditClassResultUnion = EditClassSuccessResult

export type EditClassSuccessResult = {
  __typename: 'EditClassSuccessResult'
  /** Whether the class was updated or not */
  updated: Scalars['Boolean']
}

export type EditEnrollmentInput = {
  enrollmentId: Scalars['ID']
  newSpotNumber: Scalars['Int']
}

export type EditEnrollmentResultUnion =
  | ClientIsOutsideSchedulingWindowError
  | Enrollment
  | SpotAlreadyReservedError
  | TryToSwitchToSameSpotError

export type EditRoomLayoutInput = {
  roomLayoutId: Scalars['ID']
  roomLayoutInput: RoomLayoutInput
}

export type EditUserInput = {
  siteUserInput?: InputMaybe<Array<SiteUserInput>>
  userDataInput?: InputMaybe<UserInput>
  /** This is not the same ID as the IdentifiableUser. This is the ID of the user not linked to any site */
  userId: Scalars['ID']
}

export type EditUserResultUnion = IdentifiableUser | OtherUserHasThisExternalIdError

export type EmailAlreadyUsedError = Error & {
  __typename: 'EmailAlreadyUsedError'
  code: Scalars['String']
}

export type Enrollment = {
  __typename: 'Enrollment'
  class: Class
  enrollmentInfo: EnrollmentInfoInterface
}

export type EnrollmentInfo = EnrollmentInfoInterface & {
  __typename: 'EnrollmentInfo'
  /** Returns true if the user was booked via ClassPass */
  bookedViaClassPass: Scalars['Boolean']
  enrollmentDateTime: Scalars['DateTime']
  enrollmentDateTimeWithNoTimeZone: Scalars['DateTimeWithoutTimeZone']
  enrollmentStatus: EnrollmentStatusEnum
  /**
   * Whether this enrollment has stats or not. If null, it means that the class that the enrollment belongs to
   * has not received stats yet. If the result is false, it means that the class has received stats but the enrollment
   * has not.
   */
  hasStats?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  identifiableSiteUser?: Maybe<IdentifiableSiteUser>
  isBookedForFree: Scalars['Boolean']
  isCheckedIn: Scalars['Boolean']
  isFirstTimeInThisTypeOfClass: Scalars['Boolean']
  /** Whether this is the first time of this Enrollment's user with this class' instructor */
  isFirstTimeWithThisInstructor: Scalars['Boolean']
  /** Returns true if today is the user's birthday */
  isTodayUserBirthday: Scalars['Boolean']
  /** Whether the user leaderboard is enabled */
  isUserLeaderboardEnabled: Scalars['Boolean']
  /** @deprecated Use spotNumber instead. */
  spotInfo?: Maybe<SpotInfo>
  spotNumber?: Maybe<Scalars['Int']>
}

export type EnrollmentInfoInterface = {
  enrollmentDateTime: Scalars['DateTime']
  enrollmentDateTimeWithNoTimeZone: Scalars['DateTimeWithoutTimeZone']
  enrollmentStatus: EnrollmentStatusEnum
  id: Scalars['ID']
  identifiableSiteUser?: Maybe<IdentifiableSiteUser>
}

export type EnrollmentNotFoundError = Error & {
  __typename: 'EnrollmentNotFoundError'
  code: Scalars['String']
}

export enum EnrollmentStatusEnum {
  Active = 'active',
  /** @deprecated It does not make sense to have a cancelled status for an enrollment. Use lateCancelled instead */
  Cancelled = 'cancelled',
  LateCancelled = 'lateCancelled',
  Unknown = 'unknown',
  Waitlisted = 'waitlisted'
}

export enum EnrollmentTypeEnum {
  Historical = 'historical',
  Upcoming = 'upcoming',
  Waitlist = 'waitlist'
}

export type Error = {
  code: Scalars['String']
}

export enum GenderEnum {
  /** Feminine */
  F = 'F',
  /** Masculine */
  M = 'M',
  /** Not defined */
  N = 'N'
}

export type GenderRanking = {
  __typename: 'GenderRanking'
  gender?: Maybe<GenderEnum>
  ranking?: Maybe<UserRanking>
}

export type GiftCard = {
  __typename: 'GiftCard'
  description: Scalars['String']
  grandTotal: Scalars['Float']
  id: Scalars['ID']
  purchaseUrl: Scalars['String']
  salePrice: Scalars['Float']
  site: Site
  terms: Scalars['String']
}

export type IconPosition = ClassPositionInterface & {
  __typename: 'IconPosition'
  icon: PositionIconEnum
  x: Scalars['Int']
  y: Scalars['Int']
}

export type IconPositionInput = {
  icon: PositionIconEnum
  spotNumber?: InputMaybe<Scalars['Int']>
  x: Scalars['Int']
  y: Scalars['Int']
}

export type IdentifiableSiteUser = {
  __typename: 'IdentifiableSiteUser'
  id?: Maybe<Scalars['ID']>
  identifiableUser?: Maybe<IdentifiableUser>
  siteUserInfo?: Maybe<SimpleSiteUser>
}

export type IdentifiableUser = {
  __typename: 'IdentifiableUser'
  id?: Maybe<Scalars['ID']>
  user?: Maybe<User>
}

export type Instructor = {
  __typename: 'Instructor'
  id: Scalars['ID']
  name: Scalars['String']
  site: Site
}

export type IsSmsValidationCodeValidUnion =
  | MobilePhoneAlreadyVerifiedError
  | RequestSmsValidationNeededError
  | SmsCodeValidatedSuccessfully
  | SmsValidationCodeError

export type ItemToShoppingCartInput = {
  quantity: Scalars['Int']
  sellableProductId: Scalars['ID']
}

export type LateCancellationRequiredError = Error & {
  __typename: 'LateCancellationRequiredError'
  code: Scalars['String']
}

export type MobilePhoneAlreadyVerifiedError = Error & {
  __typename: 'MobilePhoneAlreadyVerifiedError'
  code: Scalars['String']
}

export type MobilePhoneNotValidError = Error & {
  __typename: 'MobilePhoneNotValidError'
  code: Scalars['String']
}

export type Mutation = {
  __typename: 'Mutation'
  /** Accepts a late-cancelled spot in a class */
  acceptLateCancelledSpotInClass?: Maybe<AcceptLateCancelledSpotInClassResultUnion>
  /** Creates a new admin user */
  addAdminUser: AdminUserResultUnion
  /** Adds a new device token to be used for device notifications */
  addDeviceTokenToCurrentUser?: Maybe<Scalars['Boolean']>
  /** Allows to add a discount code code to a shopping cart for current user */
  addDiscountCodeToShoppingCart: Scalars['Boolean']
  /** Allows to add a giftcard code to a shopping cart for current user */
  addGiftCardCodeToShoppingCart: Scalars['Boolean']
  /** Allows to add item to shopping cart */
  addItemToShoppingCart: ShoppingCartResultUnion
  /** Books the current user in a class */
  bookClass: BookClassResultUnion
  /** Adds a user into a given class */
  bookUserIntoClass: BookClassResultUnion
  /** Cancels an enrollment done by the current user */
  cancelCurrentUserEnrollment?: Maybe<CancelEnrollmentResultUnion>
  /** Checks in a user in a class */
  checkinUserInClass?: Maybe<CheckinResultUnion>
  /** Checks out a user from a class */
  checkoutUserInClass?: Maybe<CheckoutResultUnion>
  /** Creates a copy of the current user in the given site */
  createCurrentUserInSite?: Maybe<CreateCurrentUserInSiteUnion>
  /** Creates a new room layout */
  createRoomLayout: RoomLayout
  /** It deletes the current user's account */
  deleteCurrentUserAccount?: Maybe<DeleteCurrentUserAccountUnion>
  /** Removes a devices token */
  deleteDeviceTokenToCurrentUser?: Maybe<Scalars['Boolean']>
  /** Disables a spot in a class */
  disableSpot?: Maybe<DisableEnableSpotResultUnion>
  /** Edits a class */
  editClass: EditClassResultUnion
  /** Edits an enrollment made by the current user */
  editCurrentUserEnrollment?: Maybe<EditEnrollmentResultUnion>
  /** Edits an enrollment */
  editEnrollment?: Maybe<EditEnrollmentResultUnion>
  /** Edits a room layout */
  editRoomLayout: RoomLayout
  /** Edits a user */
  editUser?: Maybe<EditUserResultUnion>
  /** Enabled a spot in a class */
  enableSpot?: Maybe<DisableEnableSpotResultUnion>
  /** Returns the html of a payment form to be used to pay */
  payfortForm: PayfortFormResult
  /** Registers a new user and returns an IdentifiableUser type */
  registerIdentifiableUser?: Maybe<IdentifiableSiteUser>
  /** Registers a new user */
  registerUser?: Maybe<User>
  /** Rejects a late-cancelled spot in a class */
  rejectLateCancelledSpotInClass?: Maybe<RejectLateBookingResultUnion>
  /** Deletes an admin user */
  removeAdminUser: Scalars['Boolean']
  /** Removes the current user's waitlist entry from a class */
  removeCurrentUserFromWaitlist?: Maybe<RemoveCurrentUserFromWaitlistUnion>
  /** Remove Item from shopping cart */
  removeItemFromShoppingCart: ShoppingCartResultUnion
  /** Removes a user from a class */
  removeUserFromClass: CancelEnrollmentResultUnion
  /** Removes a waitlist entry */
  removeUserFromWaitlist: RemoveUserFromWaitlistUnion
  /** Request a reset password link */
  requestPasswordLink?: Maybe<ResetPasswordLinkResultUnion>
  /** Requests an SMS validation code */
  requestSMSValidation?: Maybe<SmsValidationUnion>
  /** Resets the password of an admin user and sends an email with the new password */
  resetAdminUserPassword: Scalars['Boolean']
  /** Resets the current user's password */
  resetPasswordForCurrentUser?: Maybe<ResetPasswordForCurrentUserUnion>
  /** Sends a single class stats to an email */
  sendClassStatsToEmail?: Maybe<Scalars['Boolean']>
  /** Sends the class stats to the users booked in a class */
  sendClassStatsToUsers?: Maybe<Scalars['Boolean']>
  /** Sets a room layout for a list of class schedules */
  setRoomLayoutForClassSchedules: Array<ClassSchedule>
  /** Swaps a spot in a class */
  swapSpot?: Maybe<SwapSpotResultUnion>
  /** Sync all classes */
  syncAllClasses: Scalars['Boolean']
  /** Sync all gift cards from Mindbody with the local database */
  syncAllGiftCards: Scalars['Boolean']
  /** Sync one class */
  syncClass: ClassInfo
  /** Sync a class with PIQ */
  syncClassWithPIQ: ClassInfo
  /** Updates an admin user */
  updateAdminUser: AdminUserResultUnion
  /** Allows to update the current AdminUser */
  updateCurrentAdminUser: AdminUser
  /** Allows to update the favorite site for a AdminUser */
  updateCurrentAdminUserFavoriteSite: AdminUser
  updateCurrentAdminUserPassword?: Maybe<Scalars['Boolean']>
  /** Updates the current user */
  updateCurrentUser?: Maybe<User>
  /** Updates a user's password in all the sites */
  updateCurrentUserPassword?: Maybe<Scalars['Boolean']>
  /** Updates a gift card */
  updateGiftCard: GiftCard
  /** Allows to update an Item from Shopping Cart */
  updateItemInShoppingCart: ShoppingCartResultUnion
  updateUserPassword?: Maybe<Scalars['Boolean']>
}

export type MutationAcceptLateCancelledSpotInClassArgs = {
  input: AcceptLateCancelledSpotInClassInput
  site?: InputMaybe<SiteEnum>
}

export type MutationAddAdminUserArgs = {
  input: AdminUserDataInput
}

export type MutationAddDeviceTokenToCurrentUserArgs = {
  input?: InputMaybe<DeviceTokenInput>
  site?: InputMaybe<SiteEnum>
}

export type MutationAddDiscountCodeToShoppingCartArgs = {
  discountCode: Scalars['String']
}

export type MutationAddGiftCardCodeToShoppingCartArgs = {
  giftcard: Scalars['ID']
}

export type MutationAddItemToShoppingCartArgs = {
  input?: InputMaybe<ItemToShoppingCartInput>
  site: SiteEnum
}

export type MutationBookClassArgs = {
  input: BookClassInput
  site: SiteEnum
}

export type MutationBookUserIntoClassArgs = {
  input: BookUserIntoClassInput
}

export type MutationCancelCurrentUserEnrollmentArgs = {
  input: CancelEnrollmentInput
  site: SiteEnum
}

export type MutationCheckinUserInClassArgs = {
  input: CheckinUserInClass
  site: SiteEnum
}

export type MutationCheckoutUserInClassArgs = {
  input: CheckoutUserInClass
  site: SiteEnum
}

export type MutationCreateCurrentUserInSiteArgs = {
  fromSite: SiteEnum
  toSite: SiteEnum
}

export type MutationCreateRoomLayoutArgs = {
  input: RoomLayoutInput
  site: SiteEnum
}

export type MutationDeleteCurrentUserAccountArgs = {
  site: SiteEnum
  userPassword: Scalars['String']
}

export type MutationDeleteDeviceTokenToCurrentUserArgs = {
  input?: InputMaybe<DeviceTokenInput>
  site?: InputMaybe<SiteEnum>
}

export type MutationDisableSpotArgs = {
  input?: InputMaybe<DisableEnableSpotInput>
}

export type MutationEditClassArgs = {
  input: EditClassInput
}

export type MutationEditCurrentUserEnrollmentArgs = {
  input: EditEnrollmentInput
  site: SiteEnum
}

export type MutationEditEnrollmentArgs = {
  input: EditEnrollmentInput
  site: SiteEnum
}

export type MutationEditRoomLayoutArgs = {
  input: EditRoomLayoutInput
  site: SiteEnum
}

export type MutationEditUserArgs = {
  input: EditUserInput
}

export type MutationEnableSpotArgs = {
  input?: InputMaybe<DisableEnableSpotInput>
}

export type MutationPayfortFormArgs = {
  input: PayfortFormInput
  site: SiteEnum
}

export type MutationRegisterIdentifiableUserArgs = {
  input: RegisterUserInput
  site: SiteEnum
}

export type MutationRegisterUserArgs = {
  input: RegisterUserInput
  site: SiteEnum
}

export type MutationRejectLateCancelledSpotInClassArgs = {
  input: RejectLateCancelledSpotInClassInput
  site?: InputMaybe<SiteEnum>
}

export type MutationRemoveAdminUserArgs = {
  id: Scalars['ID']
}

export type MutationRemoveCurrentUserFromWaitlistArgs = {
  input: RemoveCurrentUserFromWaitlistInput
  site: SiteEnum
}

export type MutationRemoveItemFromShoppingCartArgs = {
  shoppingCartItemId: Scalars['ID']
  site: SiteEnum
}

export type MutationRemoveUserFromClassArgs = {
  input: CancelEnrollmentInput
}

export type MutationRemoveUserFromWaitlistArgs = {
  input: RemoveUserFromWaitlistInput
}

export type MutationRequestPasswordLinkArgs = {
  input?: InputMaybe<RequestPasswordLinkInput>
}

export type MutationRequestSmsValidationArgs = {
  input: RequestSmsValidationInput
}

export type MutationResetAdminUserPasswordArgs = {
  id: Scalars['ID']
}

export type MutationResetPasswordForCurrentUserArgs = {
  input?: InputMaybe<ResetPasswordForCurrentUserInput>
}

export type MutationSendClassStatsToEmailArgs = {
  input: SendClassStatsToEmailInput
}

export type MutationSendClassStatsToUsersArgs = {
  classId: Scalars['ID']
}

export type MutationSetRoomLayoutForClassSchedulesArgs = {
  input: SetRoomLayoutForClassSchedulesInput
}

export type MutationSwapSpotArgs = {
  input: EditEnrollmentInput
  site: SiteEnum
}

export type MutationSyncAllClassesArgs = {
  site: SiteEnum
}

export type MutationSyncClassArgs = {
  classId: Scalars['ID']
  site: SiteEnum
}

export type MutationSyncClassWithPiqArgs = {
  classId: Scalars['ID']
  site: SiteEnum
}

export type MutationUpdateAdminUserArgs = {
  input: UpdateAdminUserInput
}

export type MutationUpdateCurrentAdminUserArgs = {
  input: UpdateCurrentAdminUserInput
}

export type MutationUpdateCurrentAdminUserFavoriteSiteArgs = {
  input?: InputMaybe<UpdateCurrentAdminUserFavoriteSiteInput>
}

export type MutationUpdateCurrentAdminUserPasswordArgs = {
  input: UpdateCurrentUserPasswordInput
}

export type MutationUpdateCurrentUserArgs = {
  input: UserInput
}

export type MutationUpdateCurrentUserPasswordArgs = {
  input: UpdateCurrentUserPasswordInput
  site: SiteEnum
}

export type MutationUpdateGiftCardArgs = {
  input: UpdateGiftCardInput
}

export type MutationUpdateItemInShoppingCartArgs = {
  input?: InputMaybe<ItemToShoppingCartInput>
  site: SiteEnum
}

export type MutationUpdateUserPasswordArgs = {
  input: UpdateUserPasswordInput
}

export type OtherUserHasThisExternalIdError = Error & {
  __typename: 'OtherUserHasThisExternalIdError'
  code: Scalars['String']
  siteUser: IdentifiableSiteUser
}

export type PaginatedClassStats = PaginatedResult & {
  __typename: 'PaginatedClassStats'
  classStats: Array<ClassStat>
  total: Scalars['Int']
}

export type PaginatedEnrollments = PaginatedResult & {
  __typename: 'PaginatedEnrollments'
  enrollments: Array<Enrollment>
  total: Scalars['Int']
}

export type PaginatedPurchases = PaginatedResult & {
  __typename: 'PaginatedPurchases'
  purchases: Array<Purchase>
  total: Scalars['Int']
}

export type PaginatedResult = {
  total: Scalars['Int']
}

export type PaginationInput = {
  limit?: InputMaybe<Scalars['Int']>
  page?: InputMaybe<Scalars['Int']>
}

export type PasswordsDontMatchError = Error & {
  __typename: 'PasswordsDontMatchError'
  code: Scalars['String']
}

export type PayfortFormInput = {
  deviceFingerprint: Scalars['String']
  merchantReference: Scalars['ID']
  savePaymentCard: Scalars['Boolean']
}

export type PayfortFormResult = {
  __typename: 'PayfortFormResult'
  htmlForm: Scalars['String']
}

/** Error returned when a client does not have enough credit or allowance to book a class */
export type PaymentRequiredError = Error & {
  __typename: 'PaymentRequiredError'
  code: Scalars['String']
}

export type PositionAlreadyTakenError = Error & {
  __typename: 'PositionAlreadyTakenError'
  code: Scalars['String']
}

export enum PositionIconEnum {
  BenchSpot = 'benchSpot',
  BikeSpot = 'bikeSpot',
  Empty = 'empty',
  Fan = 'fan',
  Instructor = 'instructor',
  Speaker = 'speaker',
  /** @deprecated Use benchSpot or bikeSpot instead. */
  Spot = 'spot',
  Tv = 'tv'
}

export type ProductAlertBeforePurchasing = {
  __typename: 'ProductAlertBeforePurchasing'
  description: Scalars['String']
  title: Scalars['String']
}

export type ProductNotFound = Error & {
  __typename: 'ProductNotFound'
  code: Scalars['String']
}

export enum ProductType {
  ClassPackage = 'classPackage'
}

export type ProductsInput = {
  type?: InputMaybe<ProductType>
}

export type Purchase = {
  __typename: 'Purchase'
  activationDateTime: Scalars['DateTime']
  allowanceObtained: Scalars['Int']
  allowanceRemaining: Scalars['Int']
  /** Whether a package can be used or not */
  current: Scalars['Boolean']
  expirationDateTime: Scalars['DateTime']
  packageName: Scalars['String']
  paymentDateTime: Scalars['DateTime']
}

export type Query = {
  __typename: 'Query'
  /** Returns a single admin user */
  adminUser?: Maybe<AdminUser>
  /** Lists all the admin users */
  adminUsers: Array<AdminUser>
  /** Returns a list of all the available class types for a given site */
  availableClassTypes: Array<Scalars['String']>
  /** Returns a list of all the available instructors */
  availableInstructors: Array<Instructor>
  /** Returns a list of all the available sites */
  availableSites?: Maybe<Array<Site>>
  /** return the total for the current shoppingCart for the current user */
  calculateTotalForShoppingCart: ShoppingCartResultUnion
  /** Get next classes */
  calendarClasses: Array<Class>
  /** Get a single class information */
  classInfo?: Maybe<ClassInfo>
  /** Returns a list of all the class schedules for a given site */
  classSchedules: Array<ClassSchedule>
  /** Returns the list of all available countries */
  countries?: Maybe<Array<Maybe<Country>>>
  /** Returns a specific country by a given country code */
  country?: Maybe<Country>
  /** Returns the current AdminUser */
  currentAdminUser: AdminUser
  /** Returns information of the current CRANK challenge */
  currentCRANKChallenge: ChallengeInterface
  /** Returns the current user by the given Authentication header */
  currentUser?: Maybe<User>
  /**
   * List of classes where the user is already enrolled
   * @deprecated Use currentUserEnrollmentsPaginated instead
   */
  currentUserEnrollments: Array<Enrollment>
  currentUserEnrollmentsPaginated: PaginatedEnrollments
  /** List of purchases made by the current */
  currentUserPurchases?: Maybe<Array<Maybe<Purchase>>>
  currentUserPurchasesPaginated: PaginatedPurchases
  /** Get current user's ranking on a specific class */
  currentUserRankingInClass: UserInClassRanking
  /** Get current user's workout stats for a specific enrollment */
  currentUserSingleWorkoutStat?: Maybe<ClassStat>
  /**
   * Get current user's workout stats
   * @deprecated Use currentUserWorkoutStatsPaginated instead
   */
  currentUserWorkoutStats: Array<Maybe<ClassStat>>
  currentUserWorkoutStatsPaginated: PaginatedClassStats
  /** Returns the list of all the available gift cards */
  giftCards: Array<GiftCard>
  /** Verifies whether an sms validation code is valid */
  isSMSValidationCodeValid?: Maybe<IsSmsValidationCodeValidUnion>
  /** Returns a list of available products for a specific site */
  products: Array<SellableProductInterface>
  /** Returns a specific room layout */
  roomLayout?: Maybe<RoomLayout>
  /** Returns a list of available RoomLayouts for a site */
  roomLayouts: Array<RoomLayout>
  /** Returns the matched users given the query provided */
  searchSiteUser?: Maybe<Array<Maybe<IdentifiableSiteUser>>>
  /** Returns a single workout stat */
  singleWorkoutStat?: Maybe<ClassStat>
  /** Settings of a site */
  siteSettings: SiteSetting
  /** Returns a user in a specific site */
  siteUser?: Maybe<IdentifiableSiteUser>
  /** Returns a user */
  user?: Maybe<IdentifiableUser>
  /** Returns the ranking of a user in a specific class */
  userRankingInClass?: Maybe<UserInClassRanking>
  /** Returns a list of workhout stats */
  userWorkoutStats: Array<Maybe<ClassStat>>
  userWorkoutStatsPaginated: PaginatedClassStats
}

export type QueryAdminUserArgs = {
  id: Scalars['ID']
}

export type QueryAvailableClassTypesArgs = {
  site?: InputMaybe<SiteEnum>
}

export type QueryCalculateTotalForShoppingCartArgs = {
  site: SiteEnum
}

export type QueryCalendarClassesArgs = {
  params?: InputMaybe<CalendarClassesParams>
  site: SiteEnum
}

export type QueryClassInfoArgs = {
  id: Scalars['ID']
  site: SiteEnum
}

export type QueryClassSchedulesArgs = {
  site: SiteEnum
}

export type QueryCountryArgs = {
  countryCode: Scalars['String']
}

export type QueryCurrentUserEnrollmentsArgs = {
  params?: InputMaybe<CurrentUserEnrollmentsParams>
  site?: InputMaybe<SiteEnum>
}

export type QueryCurrentUserEnrollmentsPaginatedArgs = {
  pagination?: InputMaybe<PaginationInput>
  params?: InputMaybe<CurrentUserEnrollmentsParams>
  site?: InputMaybe<SiteEnum>
}

export type QueryCurrentUserPurchasesArgs = {
  site?: InputMaybe<SiteEnum>
}

export type QueryCurrentUserPurchasesPaginatedArgs = {
  pagination?: InputMaybe<PaginationInput>
  site?: InputMaybe<SiteEnum>
}

export type QueryCurrentUserRankingInClassArgs = {
  params?: InputMaybe<UserInRankingParams>
  site: SiteEnum
}

export type QueryCurrentUserSingleWorkoutStatArgs = {
  enrollmentId: Scalars['ID']
}

export type QueryCurrentUserWorkoutStatsArgs = {
  site: SiteEnum
}

export type QueryCurrentUserWorkoutStatsPaginatedArgs = {
  pagination?: InputMaybe<PaginationInput>
  site: SiteEnum
}

export type QueryIsSmsValidationCodeValidArgs = {
  smsCode: Scalars['String']
}

export type QueryProductsArgs = {
  input?: InputMaybe<ProductsInput>
  site: SiteEnum
}

export type QueryRoomLayoutArgs = {
  id: Scalars['ID']
  site: SiteEnum
}

export type QueryRoomLayoutsArgs = {
  params?: InputMaybe<RoomLayoutsInput>
  site: SiteEnum
}

export type QuerySearchSiteUserArgs = {
  query?: InputMaybe<Scalars['String']>
  site?: InputMaybe<SiteEnum>
}

export type QuerySingleWorkoutStatArgs = {
  enrollmentId: Scalars['ID']
}

export type QuerySiteSettingsArgs = {
  site?: InputMaybe<SiteEnum>
}

export type QuerySiteUserArgs = {
  id: Scalars['ID']
}

export type QueryUserArgs = {
  id: Scalars['ID']
}

export type QueryUserRankingInClassArgs = {
  classId: Scalars['ID']
  userId: Scalars['ID']
}

export type QueryUserWorkoutStatsArgs = {
  site: SiteEnum
  userId: Scalars['ID']
}

export type QueryUserWorkoutStatsPaginatedArgs = {
  pagination?: InputMaybe<PaginationInput>
  site: SiteEnum
  userId: Scalars['ID']
}

export type RegisterUserInput = {
  address1?: InputMaybe<Scalars['String']>
  address2?: InputMaybe<Scalars['String']>
  birthdate: Scalars['Date']
  city?: InputMaybe<Scalars['String']>
  country: Scalars['String']
  email: Scalars['String']
  emergencyContactName: Scalars['String']
  emergencyContactPhone: Scalars['String']
  emergencyContactRelationship?: InputMaybe<Scalars['String']>
  firstName: Scalars['String']
  gender: GenderEnum
  lastName: Scalars['String']
  leaderboardUsername: Scalars['String']
  password: Scalars['String']
  phone: Scalars['String']
  state?: InputMaybe<Scalars['String']>
  weight?: InputMaybe<Scalars['Float']>
  zipCode: Scalars['String']
}

export type RejectLateBookingResultUnion =
  | PositionAlreadyTakenError
  | RejectLateCancelledSpotInClassSuccess

export type RejectLateCancelledSpotInClassInput = {
  waitlistEntryId: Scalars['ID']
}

export type RejectLateCancelledSpotInClassSuccess = {
  __typename: 'RejectLateCancelledSpotInClassSuccess'
  success: Scalars['Boolean']
}

export type RemoveCurrentUserFromWaitlistInput = {
  waitlistEntryId: Scalars['ID']
}

export type RemoveCurrentUserFromWaitlistUnion =
  | RemoveFromWaitlistResult
  | WaitlistEntryNotFoundError

export type RemoveFromWaitlistResult = {
  __typename: 'RemoveFromWaitlistResult'
  success: Scalars['Boolean']
}

export type RemoveUserFromWaitlistInput = {
  waitlistEntryId: Scalars['ID']
}

export type RemoveUserFromWaitlistUnion = RemoveFromWaitlistResult | WaitlistEntryNotFoundError

export type RequestPasswordLinkInput = {
  email: Scalars['String']
}

export type RequestSmsValidationInput = {
  countryCode: Scalars['String']
  mobilePhone: Scalars['String']
}

export type RequestSmsValidationNeededError = Error & {
  __typename: 'RequestSMSValidationNeededError'
  code: Scalars['String']
}

export type ResetPasswordForCurrentUserInput = {
  password: Scalars['String']
  repeatedPassword: Scalars['String']
}

export type ResetPasswordForCurrentUserUnion = PasswordsDontMatchError | ResetPasswordSuccess

export type ResetPasswordLinkResultUnion =
  | ResetPasswordLinkSentSuccessfully
  | TooManyResetPasswordLinkRequestsError

export type ResetPasswordLinkSentSuccessfully = {
  __typename: 'ResetPasswordLinkSentSuccessfully'
  status: Scalars['Boolean']
}

export type ResetPasswordSuccess = {
  __typename: 'ResetPasswordSuccess'
  status: Scalars['Boolean']
}

export type RoomLayout = {
  __typename: 'RoomLayout'
  capacity: Scalars['Int']
  columns: Scalars['Int']
  id: Scalars['ID']
  matrix?: Maybe<Array<ClassPositionInterface>>
  name: Scalars['String']
  rows: Scalars['Int']
}

export type RoomLayoutInput = {
  columns: Scalars['Int']
  matrix: Array<IconPositionInput>
  name: Scalars['String']
  rows: Scalars['Int']
}

export type RoomLayoutsInput = {
  /** Amount of usable spots in the class */
  usersCapacity?: InputMaybe<Scalars['Int']>
}

export type SmsCodeValidatedSuccessfully = {
  __typename: 'SMSCodeValidatedSuccessfully'
  success: Scalars['Boolean']
}

export type SmsValidationCodeError = Error & {
  __typename: 'SMSValidationCodeError'
  code: Scalars['String']
}

export type SmsValidationUnion =
  | MobilePhoneAlreadyVerifiedError
  | MobilePhoneNotValidError
  | SuccessfulRequestSmsValidation

export type SellableProductInterface = {
  alertBeforePurchasing?: Maybe<ProductAlertBeforePurchasing>
  buttonText?: Maybe<Scalars['String']>
  currency: Scalars['String']
  id: Scalars['ID']
  isVisible: Scalars['Boolean']
  price: Scalars['Float']
  subtitle?: Maybe<Scalars['String']>
  title: Scalars['String']
}

export type SendClassStatsToEmailInput = {
  email: Scalars['String']
  enrollmentId: Scalars['ID']
}

export type SetRoomLayoutForClassSchedulesInput = {
  classSchedulesIds: Array<Scalars['ID']>
  roomLayoutId?: InputMaybe<Scalars['ID']>
}

export type ShoppingCart = {
  __typename: 'ShoppingCart'
  currency: Scalars['String']
  discountCode?: Maybe<Scalars['String']>
  giftCardCode?: Maybe<Scalars['String']>
  id: Scalars['ID']
  items: Array<ShoppingCartItem>
  subTotal?: Maybe<Scalars['Float']>
  total?: Maybe<Scalars['Float']>
}

export type ShoppingCartIsEmpty = Error & {
  __typename: 'ShoppingCartIsEmpty'
  code: Scalars['String']
}

export type ShoppingCartItem = {
  __typename: 'ShoppingCartItem'
  id: Scalars['ID']
  product: SellableProductInterface
  quantity: Scalars['Int']
  subtotal?: Maybe<Scalars['Float']>
}

export type ShoppingCartItemNotFound = Error & {
  __typename: 'ShoppingCartItemNotFound'
  code: Scalars['String']
}

export type ShoppingCartNotFound = Error & {
  __typename: 'ShoppingCartNotFound'
  code: Scalars['String']
}

export type ShoppingCartResultUnion =
  | ProductNotFound
  | ShoppingCart
  | ShoppingCartIsEmpty
  | ShoppingCartItemNotFound
  | ShoppingCartNotFound

export type SimpleSiteUser = {
  __typename: 'SimpleSiteUser'
  externalUserId: Scalars['ID']
  site: SiteEnum
}

export type Site = {
  __typename: 'Site'
  code: SiteEnum
  name: Scalars['String']
}

export enum SiteEnum {
  AbuDhabi = 'abu_dhabi',
  Dubai = 'dubai',
  TownSquare = 'town_square'
}

export type SiteSetting = {
  __typename: 'SiteSetting'
  isSynchronizingClasses: Scalars['Boolean']
  siteDateTimeNow?: Maybe<Scalars['DateTime']>
  siteTimezone?: Maybe<Scalars['String']>
}

export type SiteUserInput = {
  externalUserId: Scalars['ID']
  site: SiteEnum
}

/** Error returned when trying to book a class with a spot that is already booked */
export type SpotAlreadyReservedError = Error & {
  __typename: 'SpotAlreadyReservedError'
  code: Scalars['String']
}

export type SpotInfo = {
  __typename: 'SpotInfo'
  /** @deprecated Array of booked spots should be returned by other query to reduce complexity of creating SpotInfo instances. */
  isBooked: Scalars['Boolean']
  spotNumber: Scalars['Int']
}

export type SpotIsDisabledError = Error & {
  __typename: 'SpotIsDisabledError'
  code: Scalars['String']
}

export type SpotNotFoundError = Error & {
  __typename: 'SpotNotFoundError'
  code: Scalars['String']
}

export type State = {
  __typename: 'State'
  code: Scalars['String']
  name: Scalars['String']
}

export type SuccessfulRequestSmsValidation = {
  __typename: 'SuccessfulRequestSMSValidation'
  success: Scalars['Boolean']
}

export type SwapSpotResultUnion = SwapSpotSuccess | TryToSwitchToSameSpotError

export type SwapSpotSuccess = {
  __typename: 'SwapSpotSuccess'
  affectedEnrollment?: Maybe<EnrollmentInfoInterface>
  selectedEnrollment: EnrollmentInfoInterface
}

export type TooManyResetPasswordLinkRequestsError = Error & {
  __typename: 'TooManyResetPasswordLinkRequestsError'
  availableAgainAt?: Maybe<Scalars['DateTime']>
  code: Scalars['String']
}

export type TryToSwitchToSameSpotError = Error & {
  __typename: 'TryToSwitchToSameSpotError'
  code: Scalars['String']
}

export type UnknownError = Error & {
  __typename: 'UnknownError'
  code: Scalars['String']
}

export type UpdateAdminUserInput = {
  adminUserId: Scalars['ID']
  userDataInput: AdminUserDataInput
}

export type UpdateCurrentAdminUserFavoriteSiteInput = {
  favoriteSite?: InputMaybe<SiteEnum>
}

export type UpdateCurrentAdminUserInput = {
  showCancelledClasses: Scalars['Boolean']
}

export type UpdateCurrentUserPasswordInput = {
  currentPassword: Scalars['String']
  newPassword: Scalars['String']
}

export type UpdateGiftCardInput = {
  grandTotal?: InputMaybe<Scalars['Float']>
  id: Scalars['ID']
}

export type UpdateUserPasswordInput = {
  newPassword: Scalars['String']
  userId: Scalars['ID']
}

export type User = {
  __typename: 'User'
  address1: Scalars['String']
  address2?: Maybe<Scalars['String']>
  birthdate?: Maybe<Scalars['Date']>
  city: Scalars['String']
  country?: Maybe<Country>
  doesExistInSite: Scalars['Boolean']
  email: Scalars['String']
  emergencyContactName: Scalars['String']
  emergencyContactPhone: Scalars['String']
  emergencyContactRelationship?: Maybe<Scalars['String']>
  enrollmentInClass?: Maybe<EnrollmentInfoInterface>
  /** @deprecated Use siteUsers instead */
  existsInSites: Array<SiteEnum>
  firstName: Scalars['String']
  gender?: Maybe<GenderEnum>
  hideMetrics?: Maybe<Scalars['Boolean']>
  lastName: Scalars['String']
  leaderboardUsername?: Maybe<Scalars['String']>
  phone: Scalars['String']
  shoppingCart: ShoppingCart
  siteUsers: Array<SimpleSiteUser>
  state?: Maybe<State>
  weight?: Maybe<Scalars['Float']>
  zipCode: Scalars['String']
}

export type UserDoesExistInSiteArgs = {
  site: SiteEnum
}

export type UserEnrollmentInClassArgs = {
  classId: Scalars['ID']
}

export type UserShoppingCartArgs = {
  site: SiteEnum
}

export type UserAlreadyExistsError = Error & {
  __typename: 'UserAlreadyExistsError'
  code: Scalars['String']
}

export type UserInClassRanking = {
  __typename: 'UserInClassRanking'
  genderRanking?: Maybe<GenderRanking>
  totalRanking?: Maybe<UserRanking>
}

export type UserInRankingParams = {
  classId?: InputMaybe<Scalars['ID']>
}

export type UserInput = {
  address1?: InputMaybe<Scalars['String']>
  address2?: InputMaybe<Scalars['String']>
  birthdate?: InputMaybe<Scalars['Date']>
  city?: InputMaybe<Scalars['String']>
  country?: InputMaybe<Scalars['String']>
  emergencyContactName?: InputMaybe<Scalars['String']>
  emergencyContactPhone?: InputMaybe<Scalars['String']>
  emergencyContactRelationship?: InputMaybe<Scalars['String']>
  firstName?: InputMaybe<Scalars['String']>
  gender?: InputMaybe<GenderEnum>
  hideMetrics?: InputMaybe<Scalars['Boolean']>
  lastName?: InputMaybe<Scalars['String']>
  leaderboardUsername?: InputMaybe<Scalars['String']>
  phone?: InputMaybe<Scalars['String']>
  state?: InputMaybe<Scalars['String']>
  weight?: InputMaybe<Scalars['Float']>
  zipCode?: InputMaybe<Scalars['String']>
}

export type UserPasswordDoesNotMatchError = Error & {
  __typename: 'UserPasswordDoesNotMatchError'
  code: Scalars['String']
}

export type UserPositionInRanking = {
  __typename: 'UserPositionInRanking'
  positionInRanking: Scalars['Int']
  user: User
}

export type UserRanking = {
  __typename: 'UserRanking'
  positionInRanking?: Maybe<Scalars['Int']>
  totalMembersInRanking?: Maybe<Scalars['Int']>
}

export type UsernameAlreadyUsedError = Error & {
  __typename: 'UsernameAlreadyUsedError'
  code: Scalars['String']
}

export type ValidateResetPasswordTokenInput = {
  token: Scalars['String']
}

export type WaitlistEntry = EnrollmentInfoInterface & {
  __typename: 'WaitlistEntry'
  canBeTurnedIntoEnrollment: Scalars['Boolean']
  enrollmentDateTime: Scalars['DateTime']
  enrollmentDateTimeWithNoTimeZone: Scalars['DateTimeWithoutTimeZone']
  enrollmentStatus: EnrollmentStatusEnum
  id: Scalars['ID']
  identifiableSiteUser?: Maybe<IdentifiableSiteUser>
}

export type WaitlistEntryNotFoundError = Error & {
  __typename: 'WaitlistEntryNotFoundError'
  code: Scalars['String']
}

export type WaitlistFullError = Error & {
  __typename: 'WaitlistFullError'
  code: Scalars['String']
}

export type SiteSettingsQueryVariables = Exact<{
  site: SiteEnum
}>

export type SiteSettingsQuery = {
  __typename: 'Query'
  siteSettings: {
    __typename: 'SiteSetting'
    siteDateTimeNow?: any | null
    siteTimezone?: string | null
  }
}

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>

export type CurrentUserQuery = {
  __typename: 'Query'
  currentUser?: {
    __typename: 'User'
    email: string
    firstName: string
    lastName: string
    gender?: GenderEnum | null
    birthdate?: any | null
    city: string
    address1: string
    address2?: string | null
    zipCode: string
    phone: string
    emergencyContactName: string
    emergencyContactPhone: string
    emergencyContactRelationship?: string | null
    hideMetrics?: boolean | null
    weight?: number | null
    leaderboardUsername?: string | null
    country?: {
      __typename: 'Country'
      name: string
      code: string
      states?: Array<{ __typename: 'State'; name: string; code: string } | null> | null
    } | null
    state?: { __typename: 'State'; name: string; code: string } | null
  } | null
}

export type CurrentUserWorkoutStatsQueryVariables = Exact<{
  site: SiteEnum
}>

export type CurrentUserWorkoutStatsQuery = {
  __typename: 'Query'
  currentUserWorkoutStats: Array<{
    __typename: 'ClassStat'
    totalEnergy?: number | null
    enrollment: {
      __typename: 'Enrollment'
      enrollmentInfo:
        | { __typename: 'EnrollmentInfo'; spotNumber?: number | null; id: string }
        | { __typename: 'WaitlistEntry'; id: string }
      class: { __typename: 'Class'; name: string; start: any; duration: number }
    }
  } | null>
}

export type CurrentUserSingleWorkoutStatQueryVariables = Exact<{
  enrollmentId: Scalars['ID']
}>

export type CurrentUserSingleWorkoutStatQuery = {
  __typename: 'Query'
  currentUserSingleWorkoutStat?: {
    __typename: 'ClassStat'
    averagePower?: number | null
    highPower?: number | null
    averageRpm?: number | null
    highRpm?: number | null
    totalEnergy?: number | null
    calories?: number | null
    distance?: number | null
    enrollment: {
      __typename: 'Enrollment'
      enrollmentInfo:
        | { __typename: 'EnrollmentInfo'; spotNumber?: number | null; id: string }
        | { __typename: 'WaitlistEntry'; id: string }
      class: {
        __typename: 'Class'
        id: string
        name: string
        start: any
        duration: number
        instructorName: string
      }
    }
    adjustedChartPoints: Array<{
      __typename: 'ChartPoint'
      time?: number | null
      rpm?: number | null
      power?: number | null
    }>
  } | null
}

export type CurrentUserEnrollmentsQueryVariables = Exact<{
  site: SiteEnum
  params?: InputMaybe<CurrentUserEnrollmentsParams>
}>

export type CurrentUserEnrollmentsQuery = {
  __typename: 'Query'
  currentUserEnrollments: Array<{
    __typename: 'Enrollment'
    enrollmentInfo:
      | {
          __typename: 'EnrollmentInfo'
          spotNumber?: number | null
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
          enrollmentDateTimeWithNoTimeZone: any
        }
      | {
          __typename: 'WaitlistEntry'
          canBeTurnedIntoEnrollment: boolean
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
          enrollmentDateTimeWithNoTimeZone: any
        }
    class: {
      __typename: 'Class'
      id: string
      name: string
      description: string
      instructorName: string
      start: any
      startWithNoTimeZone: any
      duration: number
      waitListAvailable: boolean
      showAsDisabled: boolean
    }
  }>
}

export type CurrentUserEnrollmentInClassQueryVariables = Exact<{
  classId: Scalars['ID']
}>

export type CurrentUserEnrollmentInClassQuery = {
  __typename: 'Query'
  currentUser?: {
    __typename: 'User'
    enrollmentInClass?:
      | {
          __typename: 'EnrollmentInfo'
          spotNumber?: number | null
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
        }
      | {
          __typename: 'WaitlistEntry'
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
        }
      | null
  } | null
}

export type CurrentUserPurchasesQueryVariables = Exact<{
  site: SiteEnum
}>

export type CurrentUserPurchasesQuery = {
  __typename: 'Query'
  currentUserPurchases?: Array<{
    __typename: 'Purchase'
    packageName: string
    allowanceObtained: number
    allowanceRemaining: number
    paymentDateTime: any
    activationDateTime: any
    expirationDateTime: any
  } | null> | null
}

export type CountriesQueryVariables = Exact<{ [key: string]: never }>

export type CountriesQuery = {
  __typename: 'Query'
  countries?: Array<{ __typename: 'Country'; name: string; code: string } | null> | null
}

export type CountryQueryVariables = Exact<{
  countryCode: Scalars['String']
}>

export type CountryQuery = {
  __typename: 'Query'
  country?: {
    __typename: 'Country'
    name: string
    code: string
    states?: Array<{ __typename: 'State'; name: string; code: string } | null> | null
  } | null
}

export type CalendarClassesQueryVariables = Exact<{
  site: SiteEnum
  params?: InputMaybe<CalendarClassesParams>
}>

export type CalendarClassesQuery = {
  __typename: 'Query'
  calendarClasses: Array<{
    __typename: 'Class'
    id: string
    name: string
    description: string
    instructorName: string
    isSubstitute: boolean
    start: any
    startWithNoTimeZone: any
    duration: number
    waitListAvailable: boolean
    showAsDisabled: boolean
    bookingWindow: { __typename: 'BookingWindow'; startDateTime: any; endDateTime: any }
  }>
}

export type CustomCalendarClassesQueryVariables = Exact<{
  site: SiteEnum
  params?: InputMaybe<CalendarClassesParams>
  enrollmentsWaitlistParams?: InputMaybe<CurrentUserEnrollmentsParams>
  enrollmentsUpcomingParams?: InputMaybe<CurrentUserEnrollmentsParams>
}>

export type CustomCalendarClassesQuery = {
  __typename: 'Query'
  siteSettings: {
    __typename: 'SiteSetting'
    siteDateTimeNow?: any | null
    siteTimezone?: string | null
  }
  calendarClasses: Array<{
    __typename: 'Class'
    id: string
    name: string
    description: string
    instructorName: string
    start: any
    startWithNoTimeZone: any
    duration: number
    waitListAvailable: boolean
    isSubstitute: boolean
    showAsDisabled: boolean
    bookingWindow: { __typename: 'BookingWindow'; startDateTime: any; endDateTime: any }
  }>
  enrollmentsWaitlist: Array<{
    __typename: 'Enrollment'
    enrollmentInfo:
      | {
          __typename: 'EnrollmentInfo'
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
        }
      | {
          __typename: 'WaitlistEntry'
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
        }
    class: {
      __typename: 'Class'
      id: string
      name: string
      description: string
      instructorName: string
      isSubstitute: boolean
      start: any
      startWithNoTimeZone: any
      duration: number
      waitListAvailable: boolean
    }
  }>
  enrollmentsUpcoming: Array<{
    __typename: 'Enrollment'
    enrollmentInfo:
      | {
          __typename: 'EnrollmentInfo'
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
        }
      | {
          __typename: 'WaitlistEntry'
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
        }
    class: {
      __typename: 'Class'
      id: string
      name: string
      description: string
      instructorName: string
      isSubstitute: boolean
      start: any
      startWithNoTimeZone: any
      duration: number
      waitListAvailable: boolean
    }
  }>
}

export type ClassInfoQueryVariables = Exact<{
  site: SiteEnum
  id: Scalars['ID']
}>

export type ClassInfoQuery = {
  __typename: 'Query'
  classInfo?: {
    __typename: 'ClassInfo'
    usedSpots?: Array<number> | null
    class: {
      __typename: 'Class'
      id: string
      name: string
      description: string
      instructorName: string
      start: any
      startWithNoTimeZone: any
      duration: number
      waitListAvailable: boolean
    }
    roomLayout?: {
      __typename: 'RoomLayout'
      id: string
      name: string
      matrix?: Array<
        | {
            __typename: 'BookableSpot'
            spotNumber: number
            x: number
            y: number
            icon: PositionIconEnum
          }
        | { __typename: 'IconPosition'; x: number; y: number; icon: PositionIconEnum }
      > | null
    } | null
  } | null
}

export type RegisterUserMutationVariables = Exact<{
  site: SiteEnum
  input: RegisterUserInput
}>

export type RegisterUserMutation = {
  __typename: 'Mutation'
  registerUser?: { __typename: 'User'; email: string } | null
}

export type UpdateCurrentUserMutationVariables = Exact<{
  input: UserInput
}>

export type UpdateCurrentUserMutation = {
  __typename: 'Mutation'
  updateCurrentUser?: { __typename: 'User'; email: string } | null
}

export type BookClassMutationVariables = Exact<{
  site: SiteEnum
  input: BookClassInput
}>

export type BookClassMutation = {
  __typename: 'Mutation'
  bookClass:
    | { __typename: 'AddedToWaitlistSuccess' }
    | { __typename: 'BookClassSuccess' }
    | { __typename: 'BookedButInOtherSpotError' }
    | { __typename: 'BookingOverlapsAnotherOneError' }
    | { __typename: 'ClassIsFullError' }
    | { __typename: 'ClientIsAlreadyBookedError' }
    | { __typename: 'ClientIsAlreadyOnWaitlistError' }
    | { __typename: 'ClientIsOutsideSchedulingWindowError' }
    | { __typename: 'PaymentRequiredError' }
    | { __typename: 'SpotAlreadyReservedError' }
    | { __typename: 'SpotIsDisabledError' }
    | { __typename: 'UnknownError' }
    | { __typename: 'WaitlistFullError' }
}

export type CancelCurrentUserEnrollmentMutationVariables = Exact<{
  site: SiteEnum
  input: CancelEnrollmentInput
}>

export type CancelCurrentUserEnrollmentMutation = {
  __typename: 'Mutation'
  cancelCurrentUserEnrollment?:
    | { __typename: 'CancelUserEnrollmentSuccess' }
    | { __typename: 'LateCancellationRequiredError' }
    | { __typename: 'UnknownError' }
    | null
}

export type RemoveCurrentUserFromWaitlistMutationVariables = Exact<{
  site: SiteEnum
  input: RemoveCurrentUserFromWaitlistInput
}>

export type RemoveCurrentUserFromWaitlistMutation = {
  __typename: 'Mutation'
  removeCurrentUserFromWaitlist?:
    | { __typename: 'RemoveFromWaitlistResult'; success: boolean }
    | { __typename: 'WaitlistEntryNotFoundError'; code: string }
    | null
}

export type RemoveUserFromClassMutationVariables = Exact<{
  input: CancelEnrollmentInput
}>

export type RemoveUserFromClassMutation = {
  __typename: 'Mutation'
  removeUserFromClass:
    | { __typename: 'CancelUserEnrollmentSuccess' }
    | { __typename: 'LateCancellationRequiredError' }
    | { __typename: 'UnknownError' }
}

export type EditClassMutationVariables = Exact<{
  input: EditClassInput
}>

export type EditClassMutation = {
  __typename: 'Mutation'
  editClass: { __typename: 'EditClassSuccessResult'; updated: boolean }
}

export type UpdateCurrentUserPasswordMutationVariables = Exact<{
  site: SiteEnum
  input: UpdateCurrentUserPasswordInput
}>

export type UpdateCurrentUserPasswordMutation = {
  __typename: 'Mutation'
  updateCurrentUserPassword?: boolean | null
}

export type EditCurrentUserEnrollmentMutationVariables = Exact<{
  site: SiteEnum
  input: EditEnrollmentInput
}>

export type EditCurrentUserEnrollmentMutation = {
  __typename: 'Mutation'
  editCurrentUserEnrollment?:
    | { __typename: 'ClientIsOutsideSchedulingWindowError'; code: string }
    | { __typename: 'Enrollment' }
    | { __typename: 'SpotAlreadyReservedError'; code: string }
    | { __typename: 'TryToSwitchToSameSpotError'; code: string }
    | null
}

export type RequestPasswordLinkMutationVariables = Exact<{
  input?: InputMaybe<RequestPasswordLinkInput>
}>

export type RequestPasswordLinkMutation = {
  __typename: 'Mutation'
  requestPasswordLink?:
    | { __typename: 'ResetPasswordLinkSentSuccessfully'; status: boolean }
    | { __typename: 'TooManyResetPasswordLinkRequestsError'; availableAgainAt?: any | null }
    | null
}

export type ResetPasswordForCurrentUserMutationVariables = Exact<{
  input?: InputMaybe<ResetPasswordForCurrentUserInput>
}>

export type ResetPasswordForCurrentUserMutation = {
  __typename: 'Mutation'
  resetPasswordForCurrentUser?:
    | { __typename: 'PasswordsDontMatchError'; code: string }
    | { __typename: 'ResetPasswordSuccess'; status: boolean }
    | null
}

export type CurrentUserDoesExistInSiteQueryVariables = Exact<{
  site: SiteEnum
}>

export type CurrentUserDoesExistInSiteQuery = {
  __typename: 'Query'
  currentUser?: { __typename: 'User'; doesExistInSite: boolean } | null
}

export type CreateCurrentUserInSiteMutationVariables = Exact<{
  fromSite: SiteEnum
  toSite: SiteEnum
}>

export type CreateCurrentUserInSiteMutation = {
  __typename: 'Mutation'
  createCurrentUserInSite?:
    | { __typename: 'CreateCurrentUserInSiteSuccess'; result: boolean }
    | { __typename: 'UserAlreadyExistsError'; code: string }
    | null
}

export type RemoveUserFromWaitlistMutationVariables = Exact<{
  input: RemoveUserFromWaitlistInput
}>

export type RemoveUserFromWaitlistMutation = {
  __typename: 'Mutation'
  removeUserFromWaitlist:
    | { __typename: 'RemoveFromWaitlistResult'; success: boolean }
    | { __typename: 'WaitlistEntryNotFoundError'; code: string }
}

export type EditEnrollmentMutationVariables = Exact<{
  site: SiteEnum
  input: EditEnrollmentInput
}>

export type EditEnrollmentMutation = {
  __typename: 'Mutation'
  editEnrollment?:
    | { __typename: 'ClientIsOutsideSchedulingWindowError'; code: string }
    | { __typename: 'Enrollment' }
    | { __typename: 'SpotAlreadyReservedError'; code: string }
    | { __typename: 'TryToSwitchToSameSpotError'; code: string }
    | null
}

export type CurrentUserSitesQueryVariables = Exact<{ [key: string]: never }>

export type CurrentUserSitesQuery = {
  __typename: 'Query'
  currentUser?: {
    __typename: 'User'
    siteUsers: Array<{ __typename: 'SimpleSiteUser'; site: SiteEnum }>
  } | null
}

export type CurrentUserRankingInClassQueryVariables = Exact<{
  site: SiteEnum
  params?: InputMaybe<UserInRankingParams>
}>

export type CurrentUserRankingInClassQuery = {
  __typename: 'Query'
  currentUserRankingInClass: {
    __typename: 'UserInClassRanking'
    totalRanking?: {
      __typename: 'UserRanking'
      positionInRanking?: number | null
      totalMembersInRanking?: number | null
    } | null
    genderRanking?: {
      __typename: 'GenderRanking'
      gender?: GenderEnum | null
      ranking?: {
        __typename: 'UserRanking'
        positionInRanking?: number | null
        totalMembersInRanking?: number | null
      } | null
    } | null
  }
}

export type AcceptLateCancelledSpotInClassMutationVariables = Exact<{
  site: SiteEnum
  input: AcceptLateCancelledSpotInClassInput
}>

export type AcceptLateCancelledSpotInClassMutation = {
  __typename: 'Mutation'
  acceptLateCancelledSpotInClass?:
    | { __typename: 'AcceptLateCancelledSpotInClassSuccess'; success: boolean }
    | { __typename: 'ClassIsFullError' }
    | { __typename: 'ClientIsAlreadyBookedError' }
    | { __typename: 'ClientIsOutsideSchedulingWindowError' }
    | { __typename: 'PaymentRequiredError' }
    | { __typename: 'UnknownError' }
    | null
}

export type RejectLateCancelledSpotInClassMutationVariables = Exact<{
  site: SiteEnum
  input: RejectLateCancelledSpotInClassInput
}>

export type RejectLateCancelledSpotInClassMutation = {
  __typename: 'Mutation'
  rejectLateCancelledSpotInClass?:
    | { __typename: 'PositionAlreadyTakenError'; code: string }
    | { __typename: 'RejectLateCancelledSpotInClassSuccess'; success: boolean }
    | null
}

export type CurrentUserEnrollmentsPaginatedQueryVariables = Exact<{
  site: SiteEnum
  params?: InputMaybe<CurrentUserEnrollmentsParams>
  pagination?: InputMaybe<PaginationInput>
}>

export type CurrentUserEnrollmentsPaginatedQuery = {
  __typename: 'Query'
  currentUserEnrollmentsPaginated: {
    __typename: 'PaginatedEnrollments'
    total: number
    enrollments: Array<{
      __typename: 'Enrollment'
      enrollmentInfo:
        | {
            __typename: 'EnrollmentInfo'
            spotNumber?: number | null
            id: string
            enrollmentStatus: EnrollmentStatusEnum
            enrollmentDateTime: any
            enrollmentDateTimeWithNoTimeZone: any
          }
        | {
            __typename: 'WaitlistEntry'
            canBeTurnedIntoEnrollment: boolean
            id: string
            enrollmentStatus: EnrollmentStatusEnum
            enrollmentDateTime: any
            enrollmentDateTimeWithNoTimeZone: any
          }
      class: {
        __typename: 'Class'
        id: string
        name: string
        description: string
        instructorName: string
        start: any
        startWithNoTimeZone: any
        duration: number
        waitListAvailable: boolean
        showAsDisabled: boolean
      }
    }>
  }
}

export type CurrentUserWorkoutStatsPaginatedQueryVariables = Exact<{
  site: SiteEnum
  pagination?: InputMaybe<PaginationInput>
}>

export type CurrentUserWorkoutStatsPaginatedQuery = {
  __typename: 'Query'
  currentUserWorkoutStatsPaginated: {
    __typename: 'PaginatedClassStats'
    total: number
    classStats: Array<{
      __typename: 'ClassStat'
      totalEnergy?: number | null
      enrollment: {
        __typename: 'Enrollment'
        enrollmentInfo:
          | { __typename: 'EnrollmentInfo'; spotNumber?: number | null; id: string }
          | { __typename: 'WaitlistEntry'; id: string }
        class: { __typename: 'Class'; name: string; start: any; duration: number }
      }
    }>
  }
}

export type CurrentUserPurchasesPaginatedQueryVariables = Exact<{
  site: SiteEnum
  pagination?: InputMaybe<PaginationInput>
}>

export type CurrentUserPurchasesPaginatedQuery = {
  __typename: 'Query'
  currentUserPurchasesPaginated: {
    __typename: 'PaginatedPurchases'
    total: number
    purchases: Array<{
      __typename: 'Purchase'
      packageName: string
      allowanceObtained: number
      allowanceRemaining: number
      paymentDateTime: any
      activationDateTime: any
      expirationDateTime: any
      current: boolean
    }>
  }
}

export type CurrentUserPhoneNumberQueryVariables = Exact<{ [key: string]: never }>

export type CurrentUserPhoneNumberQuery = {
  __typename: 'Query'
  currentUser?: { __typename: 'User'; phone: string } | null
}

export type RequestSmsValidationMutationVariables = Exact<{
  input: RequestSmsValidationInput
}>

export type RequestSmsValidationMutation = {
  __typename: 'Mutation'
  requestSMSValidation?:
    | { __typename: 'MobilePhoneAlreadyVerifiedError'; code: string }
    | { __typename: 'MobilePhoneNotValidError'; code: string }
    | { __typename: 'SuccessfulRequestSMSValidation'; success: boolean }
    | null
}

export type IsSmsValidationCodeValidQueryVariables = Exact<{
  smsCode: Scalars['String']
}>

export type IsSmsValidationCodeValidQuery = {
  __typename: 'Query'
  isSMSValidationCodeValid?:
    | { __typename: 'MobilePhoneAlreadyVerifiedError'; code: string }
    | { __typename: 'RequestSMSValidationNeededError'; code: string }
    | { __typename: 'SMSCodeValidatedSuccessfully'; success: boolean }
    | { __typename: 'SMSValidationCodeError'; code: string }
    | null
}

export type AvailableSitesQueryVariables = Exact<{ [key: string]: never }>

export type AvailableSitesQuery = {
  __typename: 'Query'
  availableSites?: Array<{ __typename: 'Site'; name: string; code: SiteEnum }> | null
}

export type ProductsQueryVariables = Exact<{
  site: SiteEnum
  input?: InputMaybe<ProductsInput>
}>

export type ProductsQuery = {
  __typename: 'Query'
  products: Array<{
    __typename: 'ClassPackageProduct'
    type?: ClassPackageTypeEnum | null
    id: string
    title: string
    subtitle?: string | null
    currency: string
    buttonText?: string | null
    price: number
    alertBeforePurchasing?: {
      __typename: 'ProductAlertBeforePurchasing'
      title: string
      description: string
    } | null
  }>
}

export type CurrentUserShoppingCartQueryVariables = Exact<{
  site: SiteEnum
}>

export type CurrentUserShoppingCartQuery = {
  __typename: 'Query'
  currentUser?: {
    __typename: 'User'
    shoppingCart: {
      __typename: 'ShoppingCart'
      id: string
      total?: number | null
      currency: string
      subTotal?: number | null
      giftCardCode?: string | null
      discountCode?: string | null
      items: Array<{
        __typename: 'ShoppingCartItem'
        id: string
        quantity: number
        subtotal?: number | null
        product: {
          __typename: 'ClassPackageProduct'
          currency: string
          price: number
          buttonText?: string | null
          title: string
          id: string
        }
      }>
    }
  } | null
}

export type AddItemToShoppingCartMutationVariables = Exact<{
  site: SiteEnum
  input?: InputMaybe<ItemToShoppingCartInput>
}>

export type AddItemToShoppingCartMutation = {
  __typename: 'Mutation'
  addItemToShoppingCart:
    | { __typename: 'ProductNotFound'; code: string }
    | {
        __typename: 'ShoppingCart'
        id: string
        total?: number | null
        currency: string
        subTotal?: number | null
        giftCardCode?: string | null
        discountCode?: string | null
        items: Array<{
          __typename: 'ShoppingCartItem'
          id: string
          quantity: number
          subtotal?: number | null
          product: {
            __typename: 'ClassPackageProduct'
            currency: string
            price: number
            buttonText?: string | null
            title: string
            id: string
            alertBeforePurchasing?: {
              __typename: 'ProductAlertBeforePurchasing'
              title: string
              description: string
            } | null
          }
        }>
      }
    | { __typename: 'ShoppingCartIsEmpty'; code: string }
    | { __typename: 'ShoppingCartItemNotFound'; code: string }
    | { __typename: 'ShoppingCartNotFound'; code: string }
}

export type RemoveItemFromShoppingCartMutationVariables = Exact<{
  site: SiteEnum
  shoppingCartItemId: Scalars['ID']
}>

export type RemoveItemFromShoppingCartMutation = {
  __typename: 'Mutation'
  removeItemFromShoppingCart:
    | { __typename: 'ProductNotFound'; code: string }
    | {
        __typename: 'ShoppingCart'
        id: string
        total?: number | null
        currency: string
        subTotal?: number | null
        giftCardCode?: string | null
        discountCode?: string | null
        items: Array<{
          __typename: 'ShoppingCartItem'
          id: string
          quantity: number
          subtotal?: number | null
          product: {
            __typename: 'ClassPackageProduct'
            currency: string
            price: number
            buttonText?: string | null
            title: string
            id: string
            alertBeforePurchasing?: {
              __typename: 'ProductAlertBeforePurchasing'
              title: string
              description: string
            } | null
          }
        }>
      }
    | { __typename: 'ShoppingCartIsEmpty'; code: string }
    | { __typename: 'ShoppingCartItemNotFound'; code: string }
    | { __typename: 'ShoppingCartNotFound'; code: string }
}

export type UpdateItemInShoppingCartMutationVariables = Exact<{
  site: SiteEnum
  input?: InputMaybe<ItemToShoppingCartInput>
}>

export type UpdateItemInShoppingCartMutation = {
  __typename: 'Mutation'
  updateItemInShoppingCart:
    | { __typename: 'ProductNotFound'; code: string }
    | {
        __typename: 'ShoppingCart'
        id: string
        total?: number | null
        currency: string
        subTotal?: number | null
        giftCardCode?: string | null
        discountCode?: string | null
        items: Array<{
          __typename: 'ShoppingCartItem'
          id: string
          quantity: number
          subtotal?: number | null
          product: {
            __typename: 'ClassPackageProduct'
            currency: string
            price: number
            buttonText?: string | null
            title: string
            id: string
            alertBeforePurchasing?: {
              __typename: 'ProductAlertBeforePurchasing'
              title: string
              description: string
            } | null
          }
        }>
      }
    | { __typename: 'ShoppingCartIsEmpty'; code: string }
    | { __typename: 'ShoppingCartItemNotFound'; code: string }
    | { __typename: 'ShoppingCartNotFound'; code: string }
}

export type CalculateTotalForShoppingCartQueryVariables = Exact<{
  site: SiteEnum
}>

export type CalculateTotalForShoppingCartQuery = {
  __typename: 'Query'
  calculateTotalForShoppingCart:
    | { __typename: 'ProductNotFound'; code: string }
    | {
        __typename: 'ShoppingCart'
        id: string
        total?: number | null
        currency: string
        subTotal?: number | null
        giftCardCode?: string | null
        discountCode?: string | null
        items: Array<{
          __typename: 'ShoppingCartItem'
          id: string
          quantity: number
          subtotal?: number | null
          product: {
            __typename: 'ClassPackageProduct'
            currency: string
            price: number
            buttonText?: string | null
            title: string
            id: string
            alertBeforePurchasing?: {
              __typename: 'ProductAlertBeforePurchasing'
              title: string
              description: string
            } | null
          }
        }>
      }
    | { __typename: 'ShoppingCartIsEmpty'; code: string }
    | { __typename: 'ShoppingCartItemNotFound'; code: string }
    | { __typename: 'ShoppingCartNotFound'; code: string }
}

export const SiteSettingsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'siteSettings' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'siteSettings' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'siteDateTimeNow' } },
                { kind: 'Field', name: { kind: 'Name', value: 'siteTimezone' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<SiteSettingsQuery, SiteSettingsQueryVariables>
export const CurrentUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUser' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUser' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'gender' } },
                { kind: 'Field', name: { kind: 'Name', value: 'birthdate' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'country' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'states' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'code' } }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'state' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address1' } },
                { kind: 'Field', name: { kind: 'Name', value: 'address2' } },
                { kind: 'Field', name: { kind: 'Name', value: 'zipCode' } },
                { kind: 'Field', name: { kind: 'Name', value: 'phone' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emergencyContactName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emergencyContactPhone' } },
                { kind: 'Field', name: { kind: 'Name', value: 'emergencyContactRelationship' } },
                { kind: 'Field', name: { kind: 'Name', value: 'hideMetrics' } },
                { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                { kind: 'Field', name: { kind: 'Name', value: 'leaderboardUsername' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>
export const CurrentUserWorkoutStatsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUserWorkoutStats' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUserWorkoutStats' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'enrollment' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'enrollmentInfo' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'EnrollmentInfo' }
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } }
                                ]
                              }
                            }
                          ]
                        }
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'class' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'start' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'duration' } }
                          ]
                        }
                      }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'totalEnergy' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<CurrentUserWorkoutStatsQuery, CurrentUserWorkoutStatsQueryVariables>
export const CurrentUserSingleWorkoutStatDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUserSingleWorkoutStat' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'enrollmentId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUserSingleWorkoutStat' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'enrollmentId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'enrollmentId' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'enrollment' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'enrollmentInfo' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'EnrollmentInfo' }
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } }
                                ]
                              }
                            }
                          ]
                        }
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'class' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'start' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'instructorName' } }
                          ]
                        }
                      }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'averagePower' } },
                { kind: 'Field', name: { kind: 'Name', value: 'highPower' } },
                { kind: 'Field', name: { kind: 'Name', value: 'averageRpm' } },
                { kind: 'Field', name: { kind: 'Name', value: 'highRpm' } },
                { kind: 'Field', name: { kind: 'Name', value: 'totalEnergy' } },
                { kind: 'Field', name: { kind: 'Name', value: 'calories' } },
                { kind: 'Field', name: { kind: 'Name', value: 'distance' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'adjustedChartPoints' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'amountOfPoints' },
                      value: { kind: 'IntValue', value: '62' }
                    }
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'time' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'rpm' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'power' } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  CurrentUserSingleWorkoutStatQuery,
  CurrentUserSingleWorkoutStatQueryVariables
>
export const CurrentUserEnrollmentsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUserEnrollments' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'params' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'CurrentUserEnrollmentsParams' } }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUserEnrollments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'params' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'params' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'enrollmentInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enrollmentStatus' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enrollmentDateTime' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'enrollmentDateTimeWithNoTimeZone' }
                      },
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'EnrollmentInfo' }
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } }
                          ]
                        }
                      },
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'WaitlistEntry' }
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'canBeTurnedIntoEnrollment' }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'class' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'instructorName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'start' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'startWithNoTimeZone' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'waitListAvailable' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'showAsDisabled' } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<CurrentUserEnrollmentsQuery, CurrentUserEnrollmentsQueryVariables>
export const CurrentUserEnrollmentInClassDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUserEnrollmentInClass' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'classId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUser' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'enrollmentInClass' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'classId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'classId' } }
                    }
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enrollmentStatus' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enrollmentDateTime' } },
                      {
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'EnrollmentInfo' }
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  CurrentUserEnrollmentInClassQuery,
  CurrentUserEnrollmentInClassQueryVariables
>
export const CurrentUserPurchasesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUserPurchases' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUserPurchases' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'packageName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'allowanceObtained' } },
                { kind: 'Field', name: { kind: 'Name', value: 'allowanceRemaining' } },
                { kind: 'Field', name: { kind: 'Name', value: 'paymentDateTime' } },
                { kind: 'Field', name: { kind: 'Name', value: 'activationDateTime' } },
                { kind: 'Field', name: { kind: 'Name', value: 'expirationDateTime' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<CurrentUserPurchasesQuery, CurrentUserPurchasesQueryVariables>
export const CountriesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'Countries' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'countries' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<CountriesQuery, CountriesQueryVariables>
export const CountryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'country' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'countryCode' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'country' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'countryCode' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'countryCode' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'states' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<CountryQuery, CountryQueryVariables>
export const CalendarClassesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'calendarClasses' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'params' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'CalendarClassesParams' } }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'calendarClasses' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'params' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'params' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'instructorName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isSubstitute' } },
                { kind: 'Field', name: { kind: 'Name', value: 'start' } },
                { kind: 'Field', name: { kind: 'Name', value: 'startWithNoTimeZone' } },
                { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
                { kind: 'Field', name: { kind: 'Name', value: 'waitListAvailable' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'bookingWindow' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'startDateTime' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'endDateTime' } }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'showAsDisabled' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<CalendarClassesQuery, CalendarClassesQueryVariables>
export const CustomCalendarClassesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'customCalendarClasses' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'params' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'CalendarClassesParams' } }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'enrollmentsWaitlistParams' }
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'CurrentUserEnrollmentsParams' } }
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'enrollmentsUpcomingParams' }
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'CurrentUserEnrollmentsParams' } }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'siteSettings' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'siteDateTimeNow' } },
                { kind: 'Field', name: { kind: 'Name', value: 'siteTimezone' } }
              ]
            }
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'calendarClasses' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'params' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'params' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'instructorName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'start' } },
                { kind: 'Field', name: { kind: 'Name', value: 'startWithNoTimeZone' } },
                { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
                { kind: 'Field', name: { kind: 'Name', value: 'waitListAvailable' } },
                { kind: 'Field', name: { kind: 'Name', value: 'isSubstitute' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'bookingWindow' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'startDateTime' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'endDateTime' } }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'showAsDisabled' } }
              ]
            }
          },
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'enrollmentsWaitlist' },
            name: { kind: 'Name', value: 'currentUserEnrollments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'params' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'enrollmentsWaitlistParams' }
                }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'enrollmentInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enrollmentStatus' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enrollmentDateTime' } }
                    ]
                  }
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'class' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'instructorName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'isSubstitute' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'start' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'startWithNoTimeZone' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'waitListAvailable' } }
                    ]
                  }
                }
              ]
            }
          },
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'enrollmentsUpcoming' },
            name: { kind: 'Name', value: 'currentUserEnrollments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'params' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'enrollmentsUpcomingParams' }
                }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'enrollmentInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enrollmentStatus' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enrollmentDateTime' } }
                    ]
                  }
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'class' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'instructorName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'isSubstitute' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'start' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'startWithNoTimeZone' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'waitListAvailable' } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<CustomCalendarClassesQuery, CustomCalendarClassesQueryVariables>
export const ClassInfoDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'classInfo' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'classInfo' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'class' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'instructorName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'start' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'startWithNoTimeZone' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'waitListAvailable' } }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'usedSpots' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'roomLayout' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'matrix' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'x' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'y' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'icon' } },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'BookableSpot' }
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<ClassInfoQuery, ClassInfoQueryVariables>
export const RegisterUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'registerUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'RegisterUserInput' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'registerUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'email' } }]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>
export const UpdateCurrentUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateCurrentUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UserInput' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateCurrentUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'email' } }]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<UpdateCurrentUserMutation, UpdateCurrentUserMutationVariables>
export const BookClassDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'bookClass' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'BookClassInput' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'bookClass' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: '__typename' } }]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<BookClassMutation, BookClassMutationVariables>
export const CancelCurrentUserEnrollmentDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'cancelCurrentUserEnrollment' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CancelEnrollmentInput' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'cancelCurrentUserEnrollment' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: '__typename' } }]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  CancelCurrentUserEnrollmentMutation,
  CancelCurrentUserEnrollmentMutationVariables
>
export const RemoveCurrentUserFromWaitlistDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'removeCurrentUserFromWaitlist' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'RemoveCurrentUserFromWaitlistInput' }
            }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeCurrentUserFromWaitlist' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'RemoveFromWaitlistResult' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'success' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'WaitlistEntryNotFoundError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  RemoveCurrentUserFromWaitlistMutation,
  RemoveCurrentUserFromWaitlistMutationVariables
>
export const RemoveUserFromClassDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'removeUserFromClass' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CancelEnrollmentInput' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeUserFromClass' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: '__typename' } }]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<RemoveUserFromClassMutation, RemoveUserFromClassMutationVariables>
export const EditClassDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'editClass' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'EditClassInput' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'editClass' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'EditClassSuccessResult' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'updated' } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<EditClassMutation, EditClassMutationVariables>
export const UpdateCurrentUserPasswordDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateCurrentUserPassword' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateCurrentUserPasswordInput' }
            }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateCurrentUserPassword' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ]
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  UpdateCurrentUserPasswordMutation,
  UpdateCurrentUserPasswordMutationVariables
>
export const EditCurrentUserEnrollmentDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'editCurrentUserEnrollment' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'EditEnrollmentInput' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'editCurrentUserEnrollment' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'SpotAlreadyReservedError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'TryToSwitchToSameSpotError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ClientIsOutsideSchedulingWindowError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  EditCurrentUserEnrollmentMutation,
  EditCurrentUserEnrollmentMutationVariables
>
export const RequestPasswordLinkDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'requestPasswordLink' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'RequestPasswordLinkInput' } }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'requestPasswordLink' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'TooManyResetPasswordLinkRequestsError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'availableAgainAt' } }
                    ]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ResetPasswordLinkSentSuccessfully' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'status' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<RequestPasswordLinkMutation, RequestPasswordLinkMutationVariables>
export const ResetPasswordForCurrentUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'resetPasswordForCurrentUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'ResetPasswordForCurrentUserInput' }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'resetPasswordForCurrentUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'PasswordsDontMatchError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } }
                    ]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ResetPasswordSuccess' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'status' } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  ResetPasswordForCurrentUserMutation,
  ResetPasswordForCurrentUserMutationVariables
>
export const CurrentUserDoesExistInSiteDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUserDoesExistInSite' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUser' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'doesExistInSite' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'site' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  CurrentUserDoesExistInSiteQuery,
  CurrentUserDoesExistInSiteQueryVariables
>
export const CreateCurrentUserInSiteDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createCurrentUserInSite' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'fromSite' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'toSite' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createCurrentUserInSite' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'fromSite' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'fromSite' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'toSite' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'toSite' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'CreateCurrentUserInSiteSuccess' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'result' } }
                    ]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'UserAlreadyExistsError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'code' } }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  CreateCurrentUserInSiteMutation,
  CreateCurrentUserInSiteMutationVariables
>
export const RemoveUserFromWaitlistDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'removeUserFromWaitlist' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'RemoveUserFromWaitlistInput' }
            }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeUserFromWaitlist' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'RemoveFromWaitlistResult' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'success' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'WaitlistEntryNotFoundError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  RemoveUserFromWaitlistMutation,
  RemoveUserFromWaitlistMutationVariables
>
export const EditEnrollmentDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'editEnrollment' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'EditEnrollmentInput' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'editEnrollment' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Enrollment' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: '__typename' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'SpotAlreadyReservedError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'TryToSwitchToSameSpotError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ClientIsOutsideSchedulingWindowError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<EditEnrollmentMutation, EditEnrollmentMutationVariables>
export const CurrentUserSitesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUserSites' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUser' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'siteUsers' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'site' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<CurrentUserSitesQuery, CurrentUserSitesQueryVariables>
export const CurrentUserRankingInClassDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUserRankingInClass' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'params' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'UserInRankingParams' } }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUserRankingInClass' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'params' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'params' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'totalRanking' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'positionInRanking' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'totalMembersInRanking' } }
                    ]
                  }
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'genderRanking' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'gender' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'ranking' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'positionInRanking' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'totalMembersInRanking' }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  CurrentUserRankingInClassQuery,
  CurrentUserRankingInClassQueryVariables
>
export const AcceptLateCancelledSpotInClassDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'acceptLateCancelledSpotInClass' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'AcceptLateCancelledSpotInClassInput' }
            }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'acceptLateCancelledSpotInClass' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'AcceptLateCancelledSpotInClassSuccess' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'success' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  AcceptLateCancelledSpotInClassMutation,
  AcceptLateCancelledSpotInClassMutationVariables
>
export const RejectLateCancelledSpotInClassDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'rejectLateCancelledSpotInClass' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'RejectLateCancelledSpotInClassInput' }
            }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'rejectLateCancelledSpotInClass' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Error' } },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'PositionAlreadyTakenError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'RejectLateCancelledSpotInClassSuccess' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'success' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  RejectLateCancelledSpotInClassMutation,
  RejectLateCancelledSpotInClassMutationVariables
>
export const CurrentUserEnrollmentsPaginatedDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUserEnrollmentsPaginated' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'params' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'CurrentUserEnrollmentsParams' } }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaginationInput' } }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUserEnrollmentsPaginated' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'params' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'params' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pagination' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'enrollments' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'enrollmentInfo' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'enrollmentStatus' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'enrollmentDateTime' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'enrollmentDateTimeWithNoTimeZone' }
                            },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'EnrollmentInfo' }
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } }
                                ]
                              }
                            },
                            {
                              kind: 'InlineFragment',
                              typeCondition: {
                                kind: 'NamedType',
                                name: { kind: 'Name', value: 'WaitlistEntry' }
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'canBeTurnedIntoEnrollment' }
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'class' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'instructorName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'start' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'startWithNoTimeZone' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'duration' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'waitListAvailable' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'showAsDisabled' } }
                          ]
                        }
                      }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  CurrentUserEnrollmentsPaginatedQuery,
  CurrentUserEnrollmentsPaginatedQueryVariables
>
export const CurrentUserWorkoutStatsPaginatedDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUserWorkoutStatsPaginated' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaginationInput' } }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUserWorkoutStatsPaginated' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pagination' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'classStats' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'enrollment' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'enrollmentInfo' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  {
                                    kind: 'InlineFragment',
                                    typeCondition: {
                                      kind: 'NamedType',
                                      name: { kind: 'Name', value: 'EnrollmentInfo' }
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'spotNumber' }
                                        }
                                      ]
                                    }
                                  }
                                ]
                              }
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'class' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'start' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'duration' } }
                                ]
                              }
                            }
                          ]
                        }
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'totalEnergy' } }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  CurrentUserWorkoutStatsPaginatedQuery,
  CurrentUserWorkoutStatsPaginatedQueryVariables
>
export const CurrentUserPurchasesPaginatedDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUserPurchasesPaginated' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'PaginationInput' } }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUserPurchasesPaginated' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'pagination' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'pagination' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'purchases' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'packageName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'allowanceObtained' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'allowanceRemaining' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'paymentDateTime' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'activationDateTime' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'expirationDateTime' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'current' } }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'total' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  CurrentUserPurchasesPaginatedQuery,
  CurrentUserPurchasesPaginatedQueryVariables
>
export const CurrentUserPhoneNumberDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUserPhoneNumber' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUser' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'phone' } }]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<CurrentUserPhoneNumberQuery, CurrentUserPhoneNumberQueryVariables>
export const RequestSmsValidationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'requestSMSValidation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'RequestSMSValidationInput' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'requestSMSValidation' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'MobilePhoneAlreadyVerifiedError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'SuccessfulRequestSMSValidation' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'success' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'MobilePhoneNotValidError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<RequestSmsValidationMutation, RequestSmsValidationMutationVariables>
export const IsSmsValidationCodeValidDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'isSMSValidationCodeValid' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'smsCode' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'isSMSValidationCodeValid' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'smsCode' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'smsCode' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'SMSCodeValidatedSuccessfully' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'success' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'RequestSMSValidationNeededError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'SMSValidationCodeError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'MobilePhoneAlreadyVerifiedError' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<IsSmsValidationCodeValidQuery, IsSmsValidationCodeValidQueryVariables>
export const AvailableSitesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'availableSites' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'availableSites' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'code' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<AvailableSitesQuery, AvailableSitesQueryVariables>
export const ProductsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'products' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ProductsInput' } }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'products' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                { kind: 'Field', name: { kind: 'Name', value: 'subtitle' } },
                { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                { kind: 'Field', name: { kind: 'Name', value: 'buttonText' } },
                { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'alertBeforePurchasing' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } }
                    ]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ClassPackageProduct' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'type' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<ProductsQuery, ProductsQueryVariables>
export const CurrentUserShoppingCartDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'currentUserShoppingCart' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUser' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'shoppingCart' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'site' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
                    }
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'giftCardCode' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'discountCode' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'subtotal' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'product' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'buttonText' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<CurrentUserShoppingCartQuery, CurrentUserShoppingCartQueryVariables>
export const AddItemToShoppingCartDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'addItemToShoppingCart' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ItemToShoppingCartInput' } }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'addItemToShoppingCart' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCart' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'giftCardCode' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'discountCode' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'subtotal' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'product' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'alertBeforePurchasing' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'description' }
                                        }
                                      ]
                                    }
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'buttonText' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ProductNotFound' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCartNotFound' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCartIsEmpty' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCartItemNotFound' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<AddItemToShoppingCartMutation, AddItemToShoppingCartMutationVariables>
export const RemoveItemFromShoppingCartDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveItemFromShoppingCart' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'shoppingCartItemId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeItemFromShoppingCart' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'shoppingCartItemId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'shoppingCartItemId' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCart' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'giftCardCode' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'discountCode' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'subtotal' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'product' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'alertBeforePurchasing' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'description' }
                                        }
                                      ]
                                    }
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'buttonText' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ProductNotFound' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCartNotFound' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCartIsEmpty' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCartItemNotFound' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  RemoveItemFromShoppingCartMutation,
  RemoveItemFromShoppingCartMutationVariables
>
export const UpdateItemInShoppingCartDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateItemInShoppingCart' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ItemToShoppingCartInput' } }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateItemInShoppingCart' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCart' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'giftCardCode' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'discountCode' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'subtotal' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'product' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'alertBeforePurchasing' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'description' }
                                        }
                                      ]
                                    }
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'buttonText' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ProductNotFound' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCartNotFound' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCartIsEmpty' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCartItemNotFound' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  UpdateItemInShoppingCartMutation,
  UpdateItemInShoppingCartMutationVariables
>
export const CalculateTotalForShoppingCartDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'CalculateTotalForShoppingCart' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'calculateTotalForShoppingCart' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCart' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'subTotal' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'giftCardCode' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'discountCode' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'quantity' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'subtotal' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'product' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'alertBeforePurchasing' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'description' }
                                        }
                                      ]
                                    }
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: 'currency' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'price' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'buttonText' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'title' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ProductNotFound' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCartNotFound' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCartIsEmpty' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                },
                {
                  kind: 'InlineFragment',
                  typeCondition: {
                    kind: 'NamedType',
                    name: { kind: 'Name', value: 'ShoppingCartItemNotFound' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: 'code' } }]
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  CalculateTotalForShoppingCartQuery,
  CalculateTotalForShoppingCartQueryVariables
>
