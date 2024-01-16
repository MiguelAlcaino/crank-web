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

export type AcceptLateCancelledSpotInClassResultUnion = AcceptLateCancelledSpotInClassSuccess

export type AcceptLateCancelledSpotInClassSuccess = {
  __typename: 'AcceptLateCancelledSpotInClassSuccess'
  code: Scalars['String']
}

export type AddedToWaitlistSuccess = {
  __typename: 'AddedToWaitlistSuccess'
  status: Scalars['Boolean']
}

export type BookClassInput = {
  classId: Scalars['ID']
  isWaitlistBooking?: InputMaybe<Scalars['Boolean']>
  spotNumber?: InputMaybe<Scalars['Int']>
}

export type BookClassResultUnion =
  | AddedToWaitlistSuccess
  | BookClassSuccess
  | BookedButInOtherSpotError
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
  spotNumber?: InputMaybe<Scalars['Int']>
  userId: Scalars['ID']
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
  id: Scalars['ID']
  instructorName: Scalars['String']
  isSubstitute: Scalars['Boolean']
  maxCapacity: Scalars['Int']
  name: Scalars['String']
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

export type ClassPositionInterface = {
  icon: PositionIconEnum
  x: Scalars['Int']
  y: Scalars['Int']
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

export type Enrollment = {
  __typename: 'Enrollment'
  class: Class
  enrollmentInfo: EnrollmentInfoInterface
}

export type EnrollmentInfo = EnrollmentInfoInterface & {
  __typename: 'EnrollmentInfo'
  enrollmentDateTime: Scalars['DateTime']
  enrollmentStatus: EnrollmentStatusEnum
  id: Scalars['ID']
  identifiableUser?: Maybe<IdentifiableUser>
  isCheckedIn: Scalars['Boolean']
  /** @deprecated Use spotNumber instead. */
  spotInfo?: Maybe<SpotInfo>
  spotNumber?: Maybe<Scalars['Int']>
}

export type EnrollmentInfoInterface = {
  enrollmentDateTime: Scalars['DateTime']
  enrollmentStatus: EnrollmentStatusEnum
  id: Scalars['ID']
  identifiableUser?: Maybe<IdentifiableUser>
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
  All = 'all',
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

export type IdentifiableUser = {
  __typename: 'IdentifiableUser'
  id?: Maybe<Scalars['ID']>
  user?: Maybe<User>
}

export type LateCancellationRequiredError = Error & {
  __typename: 'LateCancellationRequiredError'
  code: Scalars['String']
}

export type Mutation = {
  __typename: 'Mutation'
  /** Accepts a late-cancelled spot in a class */
  acceptLateCancelledSpotInClass?: Maybe<AcceptLateCancelledSpotInClassResultUnion>
  /** Adds a new device token to be used for device notifications */
  addDeviceTokenToCurrentUser?: Maybe<Scalars['Boolean']>
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
  /** Enabled a spot in a class */
  enableSpot?: Maybe<DisableEnableSpotResultUnion>
  /** Registers a new user */
  registerUser?: Maybe<User>
  /** Rejects a late-cancelled spot in a class */
  rejectLateCancelledSpotInClass?: Maybe<RejectLateBookingResultUnion>
  /** Removes the current user's waitlist entry from a class */
  removeCurrentUserFromWaitlist?: Maybe<RemoveCurrentUserFromWaitlistUnion>
  /** Removes a user from a class */
  removeUserFromClass: CancelEnrollmentResultUnion
  /** Removes a waitlist entry */
  removeUserFromWaitlist: RemoveUserFromWaitlistUnion
  /** Request a reset password link */
  requestPasswordLink?: Maybe<ResetPasswordLinkResultUnion>
  /** Resets the current user's password */
  resetPasswordForCurrentUser?: Maybe<ResetPasswordForCurrentUserUnion>
  /** Swaps a spot in a class */
  swapSpot?: Maybe<SwapSpotResultUnion>
  /** Sync all classes */
  syncAllClasses: Array<Class>
  /** Sync one class */
  syncClass: ClassInfo
  /** Updates the current user */
  updateCurrentUser?: Maybe<User>
  /** Updates a user's password in all the sites */
  updateCurrentUserPassword?: Maybe<Scalars['Boolean']>
}

export type MutationAcceptLateCancelledSpotInClassArgs = {
  input: AcceptLateCancelledSpotInClassInput
  site?: InputMaybe<SiteEnum>
}

export type MutationAddDeviceTokenToCurrentUserArgs = {
  input?: InputMaybe<DeviceTokenInput>
  site?: InputMaybe<SiteEnum>
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

export type MutationEnableSpotArgs = {
  input?: InputMaybe<DisableEnableSpotInput>
}

export type MutationRegisterUserArgs = {
  input: RegisterUserInput
  site: SiteEnum
}

export type MutationRejectLateCancelledSpotInClassArgs = {
  input: RejectLateCancelledSpotInClassInput
  site?: InputMaybe<SiteEnum>
}

export type MutationRemoveCurrentUserFromWaitlistArgs = {
  input: RemoveCurrentUserFromWaitlistInput
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
  site: SiteEnum
}

export type MutationResetPasswordForCurrentUserArgs = {
  input?: InputMaybe<ResetPasswordForCurrentUserInput>
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

export type MutationUpdateCurrentUserArgs = {
  input: UserInput
}

export type MutationUpdateCurrentUserPasswordArgs = {
  input: UpdateCurrentUserPasswordInput
  site: SiteEnum
}

export type PasswordsDontMatchError = Error & {
  __typename: 'PasswordsDontMatchError'
  code: Scalars['String']
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
  Empty = 'empty',
  Fan = 'fan',
  Instructor = 'instructor',
  Speaker = 'speaker',
  Spot = 'spot',
  Tv = 'tv'
}

export type Purchase = {
  __typename: 'Purchase'
  activationDateTime: Scalars['DateTime']
  allowanceObtained: Scalars['Int']
  allowanceRemaining: Scalars['Int']
  expirationDateTime: Scalars['DateTime']
  packageName: Scalars['String']
  paymentDateTime: Scalars['DateTime']
}

export type Query = {
  __typename: 'Query'
  /** Get next classes */
  calendarClasses: Array<Class>
  /** Get a single class information */
  classInfo?: Maybe<ClassInfo>
  /** Returns the list of all available countries */
  countries?: Maybe<Array<Maybe<Country>>>
  /** Returns a specific country by a given country code */
  country?: Maybe<Country>
  /** Returns the current user by the given Authentication header */
  currentUser?: Maybe<User>
  /** List of classes where the user is already enrolled */
  currentUserEnrollments: Array<Enrollment>
  /** List of purchases made by the current */
  currentUserPurchases?: Maybe<Array<Maybe<Purchase>>>
  /** Get current user's ranking on a specific class */
  currentUserRankingInClass?: Maybe<UserInClassRanking>
  /** Get current user's workout stats for a specific enrollment */
  currentUserSingleWorkoutStat?: Maybe<ClassStat>
  /** Get current user's workout stats */
  currentUserWorkoutStats: Array<Maybe<ClassStat>>
  /** Returns a specific room layout */
  roomLayout?: Maybe<RoomLayout>
  /** Returns a list of available RoomLayouts for a site */
  roomLayouts: Array<RoomLayout>
  /** Returns the matched users given the query provided */
  searchUser?: Maybe<Array<Maybe<IdentifiableUser>>>
  /** Settings of a site */
  siteSettings: SiteSetting
  /** Returns a user */
  user?: Maybe<IdentifiableUser>
}

export type QueryCalendarClassesArgs = {
  params?: InputMaybe<CalendarClassesParams>
  site: SiteEnum
}

export type QueryClassInfoArgs = {
  id: Scalars['ID']
  site: SiteEnum
}

export type QueryCountryArgs = {
  countryCode: Scalars['String']
}

export type QueryCurrentUserEnrollmentsArgs = {
  params?: InputMaybe<CurrentUserEnrollmentsParams>
  site?: InputMaybe<SiteEnum>
}

export type QueryCurrentUserPurchasesArgs = {
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

export type QueryRoomLayoutArgs = {
  id: Scalars['ID']
  site: SiteEnum
}

export type QueryRoomLayoutsArgs = {
  site: SiteEnum
}

export type QuerySearchUserArgs = {
  query?: InputMaybe<Scalars['String']>
  site?: InputMaybe<SiteEnum>
}

export type QuerySiteSettingsArgs = {
  site?: InputMaybe<SiteEnum>
}

export type QueryUserArgs = {
  id: Scalars['ID']
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
  code: Scalars['String']
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

export enum SiteEnum {
  AbuDhabi = 'abu_dhabi',
  Dubai = 'dubai'
}

export type SiteSetting = {
  __typename: 'SiteSetting'
  siteDateTimeNow?: Maybe<Scalars['DateTime']>
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

export type UpdateCurrentUserPasswordInput = {
  currentPassword: Scalars['String']
  newPassword: Scalars['String']
}

export type User = {
  __typename: 'User'
  address1: Scalars['String']
  address2?: Maybe<Scalars['String']>
  birthdate?: Maybe<Scalars['Date']>
  city: Scalars['String']
  country: Country
  doesExistInSite: Scalars['Boolean']
  email: Scalars['String']
  emergencyContactName: Scalars['String']
  emergencyContactPhone: Scalars['String']
  emergencyContactRelationship?: Maybe<Scalars['String']>
  enrollmentInClass?: Maybe<EnrollmentInfoInterface>
  existsInSites: Array<SiteEnum>
  firstName: Scalars['String']
  gender?: Maybe<GenderEnum>
  hideMetrics?: Maybe<Scalars['Boolean']>
  lastName: Scalars['String']
  leaderboardUsername?: Maybe<Scalars['String']>
  phone: Scalars['String']
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

export type UserAlreadyExistsError = Error & {
  __typename: 'UserAlreadyExistsError'
  code: Scalars['String']
}

export type UserInClassRanking = {
  __typename: 'UserInClassRanking'
  genderRanking?: Maybe<GenderRanking>
  totalRanking: UserRanking
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

export type UserRanking = {
  __typename: 'UserRanking'
  positionInRanking?: Maybe<Scalars['Int']>
  totalMembersInRanking?: Maybe<Scalars['Int']>
}

export type ValidateResetPasswordTokenInput = {
  token: Scalars['String']
}

export type WaitlistEntry = EnrollmentInfoInterface & {
  __typename: 'WaitlistEntry'
  enrollmentDateTime: Scalars['DateTime']
  enrollmentStatus: EnrollmentStatusEnum
  id: Scalars['ID']
  identifiableUser?: Maybe<IdentifiableUser>
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
  siteSettings: { __typename: 'SiteSetting'; siteDateTimeNow?: any | null }
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
    country: {
      __typename: 'Country'
      name: string
      code: string
      states?: Array<{ __typename: 'State'; name: string; code: string } | null> | null
    }
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
          spotInfo?: { __typename: 'SpotInfo'; isBooked: boolean; spotNumber: number } | null
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
      start: any
      startWithNoTimeZone: any
      duration: number
      waitListAvailable: boolean
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
          spotInfo?: { __typename: 'SpotInfo'; isBooked: boolean; spotNumber: number } | null
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
  siteSettings: { __typename: 'SiteSetting'; siteDateTimeNow?: any | null }
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
            enabled?: boolean | null
            spotNumber: number
            x: number
            y: number
            icon: PositionIconEnum
            spotInfo: { __typename: 'SpotInfo'; spotNumber: number; isBooked: boolean }
          }
        | { __typename: 'IconPosition'; x: number; y: number; icon: PositionIconEnum }
      > | null
    } | null
    enrollments: Array<
      | {
          __typename: 'EnrollmentInfo'
          isCheckedIn: boolean
          spotNumber?: number | null
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
          spotInfo?: { __typename: 'SpotInfo'; isBooked: boolean; spotNumber: number } | null
        }
      | {
          __typename: 'WaitlistEntry'
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
        }
    >
  } | null
}

export type ClassInfoAdminQueryVariables = Exact<{
  site: SiteEnum
  id: Scalars['ID']
}>

export type ClassInfoAdminQuery = {
  __typename: 'Query'
  classInfo?: {
    __typename: 'ClassInfo'
    onHoldSpots: number
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
            enabled?: boolean | null
            spotNumber: number
            x: number
            y: number
            icon: PositionIconEnum
            spotInfo: { __typename: 'SpotInfo'; spotNumber: number; isBooked: boolean }
          }
        | { __typename: 'IconPosition'; x: number; y: number; icon: PositionIconEnum }
      > | null
    } | null
    enrollments: Array<
      | {
          __typename: 'EnrollmentInfo'
          isCheckedIn: boolean
          spotNumber?: number | null
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
          spotInfo?: { __typename: 'SpotInfo'; isBooked: boolean; spotNumber: number } | null
          identifiableUser?: {
            __typename: 'IdentifiableUser'
            id?: string | null
            user?: {
              __typename: 'User'
              firstName: string
              lastName: string
              email: string
              leaderboardUsername?: string | null
            } | null
          } | null
        }
      | {
          __typename: 'WaitlistEntry'
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
          identifiableUser?: {
            __typename: 'IdentifiableUser'
            id?: string | null
            user?: {
              __typename: 'User'
              firstName: string
              lastName: string
              email: string
              leaderboardUsername?: string | null
            } | null
          } | null
        }
    >
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

export type DisableSpotMutationVariables = Exact<{
  input?: InputMaybe<DisableEnableSpotInput>
}>

export type DisableSpotMutation = {
  __typename: 'Mutation'
  disableSpot?:
    | { __typename: 'DisableEnableSpotResult'; result?: boolean | null }
    | { __typename: 'SpotNotFoundError'; code: string }
    | null
}

export type EnableSpotMutationVariables = Exact<{
  input?: InputMaybe<DisableEnableSpotInput>
}>

export type EnableSpotMutation = {
  __typename: 'Mutation'
  enableSpot?:
    | { __typename: 'DisableEnableSpotResult'; result?: boolean | null }
    | { __typename: 'SpotNotFoundError'; code: string }
    | null
}

export type SearchUserQueryVariables = Exact<{
  site: SiteEnum
  query?: InputMaybe<Scalars['String']>
}>

export type SearchUserQuery = {
  __typename: 'Query'
  searchUser?: Array<{
    __typename: 'IdentifiableUser'
    id?: string | null
    user?: { __typename: 'User'; firstName: string; lastName: string; email: string } | null
  } | null> | null
}

export type BookUserIntoClassMutationVariables = Exact<{
  input: BookUserIntoClassInput
}>

export type BookUserIntoClassMutation = {
  __typename: 'Mutation'
  bookUserIntoClass:
    | { __typename: 'AddedToWaitlistSuccess' }
    | { __typename: 'BookClassSuccess' }
    | { __typename: 'BookedButInOtherSpotError' }
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
  site: SiteEnum
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

export type RoomLayoutsQueryVariables = Exact<{
  site: SiteEnum
}>

export type RoomLayoutsQuery = {
  __typename: 'Query'
  roomLayouts: Array<{ __typename: 'RoomLayout'; id: string; name: string }>
}

export type RoomLayoutQueryVariables = Exact<{
  site: SiteEnum
  id: Scalars['ID']
}>

export type RoomLayoutQuery = {
  __typename: 'Query'
  roomLayout?: {
    __typename: 'RoomLayout'
    id: string
    name: string
    columns: number
    rows: number
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
}

export type CreateRoomLayoutMutationVariables = Exact<{
  site: SiteEnum
  input: RoomLayoutInput
}>

export type CreateRoomLayoutMutation = {
  __typename: 'Mutation'
  createRoomLayout: { __typename: 'RoomLayout'; id: string }
}

export type EditRoomLayoutMutationVariables = Exact<{
  site: SiteEnum
  input: EditRoomLayoutInput
}>

export type EditRoomLayoutMutation = {
  __typename: 'Mutation'
  editRoomLayout: { __typename: 'RoomLayout'; id: string }
}

export type ClassWaitlistEntriesQueryVariables = Exact<{
  site: SiteEnum
  id: Scalars['ID']
}>

export type ClassWaitlistEntriesQuery = {
  __typename: 'Query'
  classInfo?: {
    __typename: 'ClassInfo'
    enrollments: Array<
      | {
          __typename: 'EnrollmentInfo'
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
          identifiableUser?: {
            __typename: 'IdentifiableUser'
            id?: string | null
            user?: { __typename: 'User'; firstName: string; lastName: string } | null
          } | null
        }
      | {
          __typename: 'WaitlistEntry'
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
          identifiableUser?: {
            __typename: 'IdentifiableUser'
            id?: string | null
            user?: { __typename: 'User'; firstName: string; lastName: string } | null
          } | null
        }
    >
  } | null
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

export type CheckinUserInClassMutationVariables = Exact<{
  site: SiteEnum
  input: CheckinUserInClass
}>

export type CheckinUserInClassMutation = {
  __typename: 'Mutation'
  checkinUserInClass?:
    | { __typename: 'CheckinSuccess'; success: boolean }
    | { __typename: 'EnrollmentNotFoundError'; code: string }
    | null
}

export type CheckoutUserInClassMutationVariables = Exact<{
  site: SiteEnum
  input: CheckoutUserInClass
}>

export type CheckoutUserInClassMutation = {
  __typename: 'Mutation'
  checkoutUserInClass?:
    | { __typename: 'CheckoutSuccess'; success: boolean }
    | { __typename: 'EnrollmentNotFoundError'; code: string }
    | null
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

export type SwapSpotMutationVariables = Exact<{
  site: SiteEnum
  input: EditEnrollmentInput
}>

export type SwapSpotMutation = {
  __typename: 'Mutation'
  swapSpot?:
    | { __typename: 'SwapSpotSuccess' }
    | { __typename: 'TryToSwitchToSameSpotError'; code: string }
    | null
}

export type CurrentUserSitesQueryVariables = Exact<{ [key: string]: never }>

export type CurrentUserSitesQuery = {
  __typename: 'Query'
  currentUser?: { __typename: 'User'; existsInSites: Array<SiteEnum> } | null
}

export type CurrentUserRankingInClassQueryVariables = Exact<{
  site: SiteEnum
  params?: InputMaybe<UserInRankingParams>
}>

export type CurrentUserRankingInClassQuery = {
  __typename: 'Query'
  currentUserRankingInClass?: {
    __typename: 'UserInClassRanking'
    totalRanking: {
      __typename: 'UserRanking'
      positionInRanking?: number | null
      totalMembersInRanking?: number | null
    }
    genderRanking?: {
      __typename: 'GenderRanking'
      gender?: GenderEnum | null
      ranking?: {
        __typename: 'UserRanking'
        positionInRanking?: number | null
        totalMembersInRanking?: number | null
      } | null
    } | null
  } | null
}

export type GetCalendarClassesForListQueryVariables = Exact<{
  site: SiteEnum
  params?: InputMaybe<CalendarClassesParams>
}>

export type GetCalendarClassesForListQuery = {
  __typename: 'Query'
  calendarClasses: Array<{
    __typename: 'Class'
    id: string
    name: string
    startWithNoTimeZone: any
    maxCapacity: number
    totalBooked: number
    totalUnderMaintenanceSpots: number
  }>
}

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type GetUserQuery = {
  __typename: 'Query'
  user?: {
    __typename: 'IdentifiableUser'
    id?: string | null
    user?: {
      __typename: 'User'
      firstName: string
      lastName: string
      email: string
      leaderboardUsername?: string | null
      weight?: number | null
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
      existsInSites: Array<SiteEnum>
      country: { __typename: 'Country'; code: string; name: string }
      state?: { __typename: 'State'; code: string; name: string } | null
    } | null
  } | null
}

export type ClassWaitlistIsEnabledQueryVariables = Exact<{
  site: SiteEnum
  id: Scalars['ID']
}>

export type ClassWaitlistIsEnabledQuery = {
  __typename: 'Query'
  classInfo?: {
    __typename: 'ClassInfo'
    class: { __typename: 'Class'; waitListAvailable: boolean }
  } | null
}

export type SyncClassMutationVariables = Exact<{
  site: SiteEnum
  classId: Scalars['ID']
}>

export type SyncClassMutation = {
  __typename: 'Mutation'
  syncClass: {
    __typename: 'ClassInfo'
    onHoldSpots: number
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
            enabled?: boolean | null
            spotNumber: number
            x: number
            y: number
            icon: PositionIconEnum
            spotInfo: { __typename: 'SpotInfo'; spotNumber: number; isBooked: boolean }
          }
        | { __typename: 'IconPosition'; x: number; y: number; icon: PositionIconEnum }
      > | null
    } | null
    enrollments: Array<
      | {
          __typename: 'EnrollmentInfo'
          isCheckedIn: boolean
          spotNumber?: number | null
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
          spotInfo?: { __typename: 'SpotInfo'; isBooked: boolean; spotNumber: number } | null
          identifiableUser?: {
            __typename: 'IdentifiableUser'
            id?: string | null
            user?: {
              __typename: 'User'
              firstName: string
              lastName: string
              email: string
              leaderboardUsername?: string | null
            } | null
          } | null
        }
      | {
          __typename: 'WaitlistEntry'
          id: string
          enrollmentStatus: EnrollmentStatusEnum
          enrollmentDateTime: any
          identifiableUser?: {
            __typename: 'IdentifiableUser'
            id?: string | null
            user?: {
              __typename: 'User'
              firstName: string
              lastName: string
              email: string
              leaderboardUsername?: string | null
            } | null
          } | null
        }
    >
  }
}

export type SyncAllClassesMutationVariables = Exact<{
  site: SiteEnum
}>

export type SyncAllClassesMutation = {
  __typename: 'Mutation'
  syncAllClasses: Array<{ __typename: 'Class'; id: string }>
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
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'siteDateTimeNow' } }]
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
                        kind: 'InlineFragment',
                        typeCondition: {
                          kind: 'NamedType',
                          name: { kind: 'Name', value: 'EnrollmentInfo' }
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'spotInfo' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'isBooked' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } }
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
                            { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'spotInfo' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'isBooked' } },
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
                }
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
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'siteDateTimeNow' } }]
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
                }
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
                                  { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'spotInfo' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'spotNumber' }
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'isBooked' } }
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
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'enrollments' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'status' },
                      value: { kind: 'EnumValue', value: 'active' }
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
                            { kind: 'Field', name: { kind: 'Name', value: 'isCheckedIn' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'spotInfo' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'isBooked' } },
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
export const ClassInfoAdminDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'classInfoAdmin' },
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
                                  { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'spotInfo' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'spotNumber' }
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'isBooked' } }
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
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'enrollments' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'status' },
                      value: { kind: 'EnumValue', value: 'active' }
                    }
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enrollmentStatus' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enrollmentDateTime' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'identifiableUser' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'user' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'leaderboardUsername' }
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
                          name: { kind: 'Name', value: 'EnrollmentInfo' }
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'isCheckedIn' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'spotInfo' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'isBooked' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'onHoldSpots' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<ClassInfoAdminQuery, ClassInfoAdminQueryVariables>
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
export const DisableSpotDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'disableSpot' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'DisableEnableSpotInput' } }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'disableSpot' },
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
                    name: { kind: 'Name', value: 'DisableEnableSpotResult' }
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
                    name: { kind: 'Name', value: 'SpotNotFoundError' }
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
} as unknown as DocumentNode<DisableSpotMutation, DisableSpotMutationVariables>
export const EnableSpotDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'enableSpot' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'DisableEnableSpotInput' } }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'enableSpot' },
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
                    name: { kind: 'Name', value: 'DisableEnableSpotResult' }
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
                    name: { kind: 'Name', value: 'SpotNotFoundError' }
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
} as unknown as DocumentNode<EnableSpotMutation, EnableSpotMutationVariables>
export const SearchUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'searchUser' },
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
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'query' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'searchUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'query' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'query' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } }
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
} as unknown as DocumentNode<SearchUserQuery, SearchUserQueryVariables>
export const BookUserIntoClassDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'bookUserIntoClass' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'BookUserIntoClassInput' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'bookUserIntoClass' },
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
} as unknown as DocumentNode<BookUserIntoClassMutation, BookUserIntoClassMutationVariables>
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
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'site' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'SiteEnum' } }
          }
        },
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
export const RoomLayoutsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'roomLayouts' },
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
            name: { kind: 'Name', value: 'roomLayouts' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'name' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<RoomLayoutsQuery, RoomLayoutsQueryVariables>
export const RoomLayoutDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'roomLayout' },
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
            name: { kind: 'Name', value: 'roomLayout' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'columns' } },
                { kind: 'Field', name: { kind: 'Name', value: 'rows' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'matrix' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
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
} as unknown as DocumentNode<RoomLayoutQuery, RoomLayoutQueryVariables>
export const CreateRoomLayoutDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createRoomLayout' },
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
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'RoomLayoutInput' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createRoomLayout' },
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
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<CreateRoomLayoutMutation, CreateRoomLayoutMutationVariables>
export const EditRoomLayoutDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'editRoomLayout' },
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
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'EditRoomLayoutInput' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'editRoomLayout' },
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
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<EditRoomLayoutMutation, EditRoomLayoutMutationVariables>
export const ClassWaitlistEntriesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'classWaitlistEntries' },
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
                  name: { kind: 'Name', value: 'enrollments' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'status' },
                      value: { kind: 'EnumValue', value: 'waitlisted' }
                    }
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enrollmentStatus' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enrollmentDateTime' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'identifiableUser' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'user' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'lastName' } }
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
} as unknown as DocumentNode<ClassWaitlistEntriesQuery, ClassWaitlistEntriesQueryVariables>
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
export const CheckinUserInClassDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'checkinUserInClass' },
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
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CheckinUserInClass' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'checkinUserInClass' },
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
                    name: { kind: 'Name', value: 'CheckinSuccess' }
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
                    name: { kind: 'Name', value: 'EnrollmentNotFoundError' }
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
} as unknown as DocumentNode<CheckinUserInClassMutation, CheckinUserInClassMutationVariables>
export const CheckoutUserInClassDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'checkoutUserInClass' },
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
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CheckoutUserInClass' } }
          }
        }
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'checkoutUserInClass' },
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
                    name: { kind: 'Name', value: 'CheckoutSuccess' }
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
                    name: { kind: 'Name', value: 'EnrollmentNotFoundError' }
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
} as unknown as DocumentNode<CheckoutUserInClassMutation, CheckoutUserInClassMutationVariables>
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
export const SwapSpotDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'swapSpot' },
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
            name: { kind: 'Name', value: 'swapSpot' },
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
                    name: { kind: 'Name', value: 'SwapSpotSuccess' }
                  },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [{ kind: 'Field', name: { kind: 'Name', value: '__typename' } }]
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
} as unknown as DocumentNode<SwapSpotMutation, SwapSpotMutationVariables>
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
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'existsInSites' } }]
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
export const GetCalendarClassesForListDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getCalendarClassesForList' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'startWithNoTimeZone' } },
                { kind: 'Field', name: { kind: 'Name', value: 'maxCapacity' } },
                { kind: 'Field', name: { kind: 'Name', value: 'totalBooked' } },
                { kind: 'Field', name: { kind: 'Name', value: 'totalUnderMaintenanceSpots' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<
  GetCalendarClassesForListQuery,
  GetCalendarClassesForListQueryVariables
>
export const GetUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getUser' },
      variableDefinitions: [
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
            name: { kind: 'Name', value: 'user' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'leaderboardUsername' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'weight' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'gender' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'birthdate' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'country' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } }
                          ]
                        }
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'state' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'code' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } }
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
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'emergencyContactRelationship' }
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'hideMetrics' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'existsInSites' } }
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
} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>
export const ClassWaitlistIsEnabledDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'classWaitlistIsEnabled' },
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
} as unknown as DocumentNode<ClassWaitlistIsEnabledQuery, ClassWaitlistIsEnabledQueryVariables>
export const SyncClassDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'syncClass' },
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
            name: { kind: 'Name', value: 'syncClass' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'classId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'classId' } }
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
                                  { kind: 'Field', name: { kind: 'Name', value: 'enabled' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'spotInfo' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'spotNumber' }
                                        },
                                        { kind: 'Field', name: { kind: 'Name', value: 'isBooked' } }
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
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'enrollments' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'status' },
                      value: { kind: 'EnumValue', value: 'active' }
                    }
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enrollmentStatus' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'enrollmentDateTime' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'identifiableUser' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'user' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'leaderboardUsername' }
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
                          name: { kind: 'Name', value: 'EnrollmentInfo' }
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'isCheckedIn' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'spotInfo' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'isBooked' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'spotNumber' } }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    ]
                  }
                },
                { kind: 'Field', name: { kind: 'Name', value: 'onHoldSpots' } }
              ]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<SyncClassMutation, SyncClassMutationVariables>
export const SyncAllClassesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'syncAllClasses' },
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
            name: { kind: 'Name', value: 'syncAllClasses' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'site' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'site' } }
              }
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }]
            }
          }
        ]
      }
    }
  ]
} as unknown as DocumentNode<SyncAllClassesMutation, SyncAllClassesMutationVariables>
