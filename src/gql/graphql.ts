/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Format: Y-m-d */
  Date: any;
  DateTime: any;
  DateTimeWithoutTimeZone: any;
};

export type AcceptLateCancelledSpotInClassInput = {
  waitlistEntryId: Scalars['ID'];
};

export type AcceptLateCancelledSpotInClassResultUnion = AcceptLateCancelledSpotInClassSuccess;

export type AcceptLateCancelledSpotInClassSuccess = {
  __typename?: 'AcceptLateCancelledSpotInClassSuccess';
  code: Scalars['String'];
};

export type AddedToWaitlistSuccess = {
  __typename?: 'AddedToWaitlistSuccess';
  status: Scalars['Boolean'];
};

export type BookClassInput = {
  classId: Scalars['ID'];
  isWaitlistBooking?: InputMaybe<Scalars['Boolean']>;
  spotNumber?: InputMaybe<Scalars['Int']>;
};

export type BookClassResultUnion = AddedToWaitlistSuccess | BookClassSuccess | BookedButInOtherSpotError | ClassIsFullError | ClientIsAlreadyBookedError | ClientIsAlreadyOnWaitlistError | ClientIsOutsideSchedulingWindowError | PaymentRequiredError | SpotAlreadyReservedError | UnknownError | WaitlistFullError;

export type BookClassSuccess = {
  __typename?: 'BookClassSuccess';
  status: Scalars['Boolean'];
};

export type BookableSpot = ClassPositionInterface & {
  __typename?: 'BookableSpot';
  icon: PositionIconEnum;
  spotInfo: SpotInfo;
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type BookedButInOtherSpotError = Error & {
  __typename?: 'BookedButInOtherSpotError';
  code: Scalars['String'];
  givenSpot: Scalars['Int'];
  requiredSpot: Scalars['Int'];
};

export type BookingWindow = {
  __typename?: 'BookingWindow';
  endDateTime: Scalars['DateTime'];
  startDateTime: Scalars['DateTime'];
};

export type CalendarClassesParams = {
  endDate?: InputMaybe<Scalars['Date']>;
  startDate?: InputMaybe<Scalars['Date']>;
};

export type CancelEnrollmentInput = {
  enrollmentId: Scalars['ID'];
  lateCancel?: InputMaybe<Scalars['Boolean']>;
};

export type CancelEnrollmentResultUnion = CancelUserEnrollmentSuccess | LateCancellationRequiredError | UnknownError;

export type CancelUserEnrollmentSuccess = {
  __typename?: 'CancelUserEnrollmentSuccess';
  status?: Maybe<Scalars['Boolean']>;
};

export type ChartPoint = {
  __typename?: 'ChartPoint';
  power?: Maybe<Scalars['Int']>;
  rpm?: Maybe<Scalars['Int']>;
  time?: Maybe<Scalars['Int']>;
};

export type Class = {
  __typename?: 'Class';
  bookingWindow: BookingWindow;
  description: Scalars['String'];
  duration: Scalars['Int'];
  id: Scalars['ID'];
  instructorName: Scalars['String'];
  isSubstitute: Scalars['Boolean'];
  name: Scalars['String'];
  start: Scalars['DateTime'];
  startWithNoTimeZone: Scalars['DateTimeWithoutTimeZone'];
  waitListAvailable: Scalars['Boolean'];
};

export type ClassInfo = {
  __typename?: 'ClassInfo';
  class: Class;
  matrix?: Maybe<Array<ClassPositionInterface>>;
};

export type ClassIsFullError = Error & {
  __typename?: 'ClassIsFullError';
  code: Scalars['String'];
};

export type ClassPositionInterface = {
  icon: PositionIconEnum;
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type ClassStat = {
  __typename?: 'ClassStat';
  /** Amount of chart points adjusted to the amount of the requested ones. Values for each points are the average of each interval */
  adjustedChartPoints: Array<ChartPoint>;
  averagePower?: Maybe<Scalars['Float']>;
  averageRpm?: Maybe<Scalars['Float']>;
  calories?: Maybe<Scalars['Float']>;
  chartPoints: Array<ChartPoint>;
  classId: Scalars['ID'];
  className?: Maybe<Scalars['String']>;
  distance?: Maybe<Scalars['Float']>;
  distanceUnit?: Maybe<Scalars['String']>;
  /** Class duration in minutes */
  duration?: Maybe<Scalars['Int']>;
  highPower?: Maybe<Scalars['Float']>;
  highRpm?: Maybe<Scalars['Float']>;
  instructorName?: Maybe<Scalars['String']>;
  spotNumber?: Maybe<Scalars['Int']>;
  startDateTime: Scalars['DateTime'];
  totalEnergy?: Maybe<Scalars['Float']>;
};


export type ClassStatAdjustedChartPointsArgs = {
  amountOfPoints?: InputMaybe<Scalars['Int']>;
};

/** Error returned when a client is already booked in a class */
export type ClientIsAlreadyBookedError = Error & {
  __typename?: 'ClientIsAlreadyBookedError';
  code: Scalars['String'];
};

export type ClientIsAlreadyOnWaitlistError = Error & {
  __typename?: 'ClientIsAlreadyOnWaitlistError';
  code: Scalars['String'];
};

/** Error returned when a client tries to book a class which is not permitted to book any longer. The booking window has passed. */
export type ClientIsOutsideSchedulingWindowError = Error & {
  __typename?: 'ClientIsOutsideSchedulingWindowError';
  code: Scalars['String'];
};

export type Country = {
  __typename?: 'Country';
  code: Scalars['String'];
  name: Scalars['String'];
  states?: Maybe<Array<Maybe<State>>>;
};

export type CurrentUserEnrollmentsParams = {
  endDate?: InputMaybe<Scalars['Date']>;
  enrollmentType?: InputMaybe<EnrollmentTypeEnum>;
  startDate?: InputMaybe<Scalars['Date']>;
};

export type DeviceTokenInput = {
  deviceToken: Scalars['String'];
};

export type EditEnrollmentInput = {
  enrollmentId: Scalars['ID'];
  newSpotNumber: Scalars['Int'];
};

export type EditEnrollmentResultUnion = ClientIsOutsideSchedulingWindowError | Enrollment | SpotAlreadyReservedError | TryToSwitchToSameSpotError;

export type Enrollment = {
  __typename?: 'Enrollment';
  class: Class;
  enrollmentInfo: EnrollmentInfo;
};

export type EnrollmentInfo = {
  __typename?: 'EnrollmentInfo';
  enrollmentDateTime: Scalars['DateTime'];
  enrollmentStatus: EnrollmentStatusEnum;
  id: Scalars['ID'];
  spotInfo?: Maybe<SpotInfo>;
};

export enum EnrollmentStatusEnum {
  Active = 'active',
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
  code: Scalars['String'];
};

export type ExpiredResetPasswordTokenError = Error & {
  __typename?: 'ExpiredResetPasswordTokenError';
  code: Scalars['String'];
};

export enum GenderEnum {
  /** Feminine */
  F = 'F',
  /** Masculine */
  M = 'M',
  /** Not defined */
  N = 'N'
}

export type GenderRanking = {
  __typename?: 'GenderRanking';
  gender?: Maybe<GenderEnum>;
  ranking?: Maybe<UserRanking>;
};

export type IconPosition = ClassPositionInterface & {
  __typename?: 'IconPosition';
  icon: PositionIconEnum;
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type LateCancellationRequiredError = Error & {
  __typename?: 'LateCancellationRequiredError';
  code: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Accepts a late-cancelled spot in a class */
  acceptLateCancelledSpotInClass?: Maybe<AcceptLateCancelledSpotInClassResultUnion>;
  /** Adds a new device token to be used for device notifications */
  addDeviceTokenToCurrentUser?: Maybe<Scalars['Boolean']>;
  /** Books the current user in a class */
  bookClass: BookClassResultUnion;
  /** Cancels an enrollment done by the current user */
  cancelCurrentUserEnrollment?: Maybe<CancelEnrollmentResultUnion>;
  /** Removes a devices token */
  deleteDeviceTokenToCurrentUser?: Maybe<Scalars['Boolean']>;
  /** Edits an enrollment made by the current user */
  editCurrentUserEnrollment?: Maybe<EditEnrollmentResultUnion>;
  /** Registers a new user */
  registerUser?: Maybe<User>;
  /** Rejects a late-cancelled spot in a class */
  rejectLateCancelledSpotInClass?: Maybe<RejectLateBookingResultUnion>;
  /** Removes the current user's waitlist entry from a class */
  removeCurrentUserFromWaitlist?: Maybe<RemoveCurrentUserFromWaitlistUnion>;
  /** Request a reset password link */
  requestPasswordLink?: Maybe<ResetPasswordLinkResultUnion>;
  /** Resets the current user's password */
  resetPasswordForCurrentUser?: Maybe<ResetPasswordForCurrentUserUnion>;
  /** Updates the current user */
  updateCurrentUser?: Maybe<User>;
  /** Updates a user's password in all the sites */
  updateCurrentUserPassword?: Maybe<Scalars['Boolean']>;
  /** Validates a reset password token */
  validateResetPasswordToken?: Maybe<ValidateResetPasswordTokenResultUnion>;
};


export type MutationAcceptLateCancelledSpotInClassArgs = {
  input: AcceptLateCancelledSpotInClassInput;
  site?: InputMaybe<SiteEnum>;
};


export type MutationAddDeviceTokenToCurrentUserArgs = {
  input?: InputMaybe<DeviceTokenInput>;
  site?: InputMaybe<SiteEnum>;
};


export type MutationBookClassArgs = {
  input: BookClassInput;
  site: SiteEnum;
};


export type MutationCancelCurrentUserEnrollmentArgs = {
  input: CancelEnrollmentInput;
  site: SiteEnum;
};


export type MutationDeleteDeviceTokenToCurrentUserArgs = {
  input?: InputMaybe<DeviceTokenInput>;
  site?: InputMaybe<SiteEnum>;
};


export type MutationEditCurrentUserEnrollmentArgs = {
  input: EditEnrollmentInput;
  site: SiteEnum;
};


export type MutationRegisterUserArgs = {
  input: RegisterUserInput;
  site: SiteEnum;
};


export type MutationRejectLateCancelledSpotInClassArgs = {
  input: RejectLateCancelledSpotInClassInput;
  site?: InputMaybe<SiteEnum>;
};


export type MutationRemoveCurrentUserFromWaitlistArgs = {
  input: RemoveCurrentUserFromWaitlistInput;
  site: SiteEnum;
};


export type MutationRequestPasswordLinkArgs = {
  input?: InputMaybe<RequestPasswordLinkInput>;
  site: SiteEnum;
};


export type MutationResetPasswordForCurrentUserArgs = {
  input?: InputMaybe<ResetPasswordForCurrentUserInput>;
};


export type MutationUpdateCurrentUserArgs = {
  input: UserInput;
};


export type MutationUpdateCurrentUserPasswordArgs = {
  input: UpdateCurrentUserPasswordInput;
  site: SiteEnum;
};


export type MutationValidateResetPasswordTokenArgs = {
  input?: InputMaybe<ValidateResetPasswordTokenInput>;
};

export type NotValidResetPasswordTokenError = Error & {
  __typename?: 'NotValidResetPasswordTokenError';
  code: Scalars['String'];
};

export type PasswordsDontMatchError = Error & {
  __typename?: 'PasswordsDontMatchError';
  code: Scalars['String'];
};

/** Error returned when a client does not have enough credit or allowance to book a class */
export type PaymentRequiredError = Error & {
  __typename?: 'PaymentRequiredError';
  code: Scalars['String'];
};

export type PositionAlreadyTakenError = Error & {
  __typename?: 'PositionAlreadyTakenError';
  code: Scalars['String'];
};

export enum PositionIconEnum {
  Empty = 'empty',
  Fan = 'fan',
  Instructor = 'instructor',
  Speaker = 'speaker',
  Spot = 'spot',
  Tv = 'tv'
}

export type Purchase = {
  __typename?: 'Purchase';
  activationDateTime: Scalars['DateTime'];
  allowanceObtained: Scalars['Int'];
  allowanceRemaining: Scalars['Int'];
  expirationDateTime: Scalars['DateTime'];
  packageName: Scalars['String'];
  paymentDateTime: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  /** Get next classes */
  calendarClasses: Array<Class>;
  /** Get a single class information */
  classInfo?: Maybe<ClassInfo>;
  /** Returns the list of all available countries */
  countries?: Maybe<Array<Maybe<Country>>>;
  /** Returns a specific country by a given country code */
  country?: Maybe<Country>;
  /** Returns the current user by the given Authentication header */
  currentUser?: Maybe<User>;
  /** List of classes where the user is already enrolled */
  currentUserEnrollments: Array<Enrollment>;
  /** List of purchases made by the current */
  currentUserPurchases?: Maybe<Array<Maybe<Purchase>>>;
  /** Get current user's ranking on a specific class */
  currentUserRankingInClass?: Maybe<UserInClassRanking>;
  /** Get current user's workout stats */
  currentUserWorkoutStats: Array<Maybe<ClassStat>>;
  /** Settings of a site */
  siteSettings: SiteSetting;
};


export type QueryCalendarClassesArgs = {
  params?: InputMaybe<CalendarClassesParams>;
  site: SiteEnum;
};


export type QueryClassInfoArgs = {
  id: Scalars['ID'];
  site: SiteEnum;
};


export type QueryCountryArgs = {
  countryCode: Scalars['String'];
};


export type QueryCurrentUserEnrollmentsArgs = {
  params?: InputMaybe<CurrentUserEnrollmentsParams>;
  site?: InputMaybe<SiteEnum>;
};


export type QueryCurrentUserPurchasesArgs = {
  site?: InputMaybe<SiteEnum>;
};


export type QueryCurrentUserRankingInClassArgs = {
  params?: InputMaybe<UserInRankingParams>;
  site: SiteEnum;
};


export type QueryCurrentUserWorkoutStatsArgs = {
  site: SiteEnum;
};


export type QuerySiteSettingsArgs = {
  site?: InputMaybe<SiteEnum>;
};

export type RegisterUserInput = {
  address1?: InputMaybe<Scalars['String']>;
  address2?: InputMaybe<Scalars['String']>;
  birthdate: Scalars['Date'];
  city?: InputMaybe<Scalars['String']>;
  country: Scalars['String'];
  email: Scalars['String'];
  emergencyContactName: Scalars['String'];
  emergencyContactPhone: Scalars['String'];
  emergencyContactRelationship?: InputMaybe<Scalars['String']>;
  firstName: Scalars['String'];
  gender: GenderEnum;
  lastName: Scalars['String'];
  leaderboardUsername: Scalars['String'];
  password: Scalars['String'];
  phone: Scalars['String'];
  state?: InputMaybe<Scalars['String']>;
  weight?: InputMaybe<Scalars['Float']>;
  zipCode: Scalars['String'];
};

export type RejectLateBookingResultUnion = PositionAlreadyTakenError | RejectLateCancelledSpotInClassSuccess;

export type RejectLateCancelledSpotInClassInput = {
  waitlistEntryId: Scalars['ID'];
};

export type RejectLateCancelledSpotInClassSuccess = {
  __typename?: 'RejectLateCancelledSpotInClassSuccess';
  code: Scalars['String'];
};

export type RemoveCurrentUserFromWaitlistInput = {
  waitlistEntryId: Scalars['ID'];
};

export type RemoveCurrentUserFromWaitlistUnion = RemoveFromWaitlistResult | WaitlistEntryNotFoundError;

export type RemoveFromWaitlistResult = {
  __typename?: 'RemoveFromWaitlistResult';
  success: Scalars['Boolean'];
};

export type RequestPasswordLinkInput = {
  email: Scalars['String'];
};

export type ResetPasswordForCurrentUserInput = {
  password: Scalars['String'];
  repeatedPassword: Scalars['String'];
};

export type ResetPasswordForCurrentUserUnion = PasswordsDontMatchError | ResetPasswordSuccess;

export type ResetPasswordLinkResultUnion = ResetPasswordLinkSentSuccessfully | TooManyResetPasswordLinkRequestsError;

export type ResetPasswordLinkSentSuccessfully = {
  __typename?: 'ResetPasswordLinkSentSuccessfully';
  status: Scalars['Boolean'];
};

export type ResetPasswordSuccess = {
  __typename?: 'ResetPasswordSuccess';
  status: Scalars['Boolean'];
};

export type ResetPasswordTokenValid = {
  __typename?: 'ResetPasswordTokenValid';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export enum SiteEnum {
  AbuDhabi = 'abu_dhabi',
  Dubai = 'dubai'
}

export type SiteSetting = {
  __typename?: 'SiteSetting';
  siteDateTimeNow?: Maybe<Scalars['DateTime']>;
};

/** Error returned when trying to book a class with a spot that is already booked */
export type SpotAlreadyReservedError = Error & {
  __typename?: 'SpotAlreadyReservedError';
  code: Scalars['String'];
};

export type SpotInfo = {
  __typename?: 'SpotInfo';
  isBooked: Scalars['Boolean'];
  spotNumber: Scalars['Int'];
};

export type State = {
  __typename?: 'State';
  code: Scalars['String'];
  name: Scalars['String'];
};

export type TooManyResetPasswordLinkRequestsError = Error & {
  __typename?: 'TooManyResetPasswordLinkRequestsError';
  availableAgainAt?: Maybe<Scalars['DateTime']>;
  code: Scalars['String'];
};

export type TryToSwitchToSameSpotError = Error & {
  __typename?: 'TryToSwitchToSameSpotError';
  code: Scalars['String'];
};

export type UnknownError = Error & {
  __typename?: 'UnknownError';
  code: Scalars['String'];
};

export type UpdateCurrentUserPasswordInput = {
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  address1: Scalars['String'];
  address2?: Maybe<Scalars['String']>;
  birthdate?: Maybe<Scalars['Date']>;
  city: Scalars['String'];
  country: Country;
  email: Scalars['String'];
  emergencyContactName: Scalars['String'];
  emergencyContactPhone: Scalars['String'];
  emergencyContactRelationship?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  gender?: Maybe<GenderEnum>;
  hideMetrics?: Maybe<Scalars['Boolean']>;
  lastName: Scalars['String'];
  leaderboardUsername?: Maybe<Scalars['String']>;
  phone: Scalars['String'];
  state?: Maybe<State>;
  weight?: Maybe<Scalars['Float']>;
  zipCode: Scalars['String'];
};

export type UserInClassRanking = {
  __typename?: 'UserInClassRanking';
  genderRanking?: Maybe<GenderRanking>;
  totalRanking: UserRanking;
};

export type UserInRankingParams = {
  classId?: InputMaybe<Scalars['ID']>;
};

export type UserInput = {
  address1?: InputMaybe<Scalars['String']>;
  address2?: InputMaybe<Scalars['String']>;
  birthdate?: InputMaybe<Scalars['Date']>;
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  emergencyContactName?: InputMaybe<Scalars['String']>;
  emergencyContactPhone?: InputMaybe<Scalars['String']>;
  emergencyContactRelationship?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<GenderEnum>;
  hideMetrics?: InputMaybe<Scalars['Boolean']>;
  lastName?: InputMaybe<Scalars['String']>;
  leaderboardUsername?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  weight?: InputMaybe<Scalars['Float']>;
  zipCode?: InputMaybe<Scalars['String']>;
};

export type UserRanking = {
  __typename?: 'UserRanking';
  positionInRanking?: Maybe<Scalars['Int']>;
  totalMembersInRanking?: Maybe<Scalars['Int']>;
};

export type ValidateResetPasswordTokenInput = {
  token: Scalars['String'];
};

export type ValidateResetPasswordTokenResultUnion = ExpiredResetPasswordTokenError | NotValidResetPasswordTokenError | ResetPasswordTokenValid;

export type WaitlistEntryNotFoundError = Error & {
  __typename?: 'WaitlistEntryNotFoundError';
  code: Scalars['String'];
};

export type WaitlistFullError = Error & {
  __typename?: 'WaitlistFullError';
  code: Scalars['String'];
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', email: string, firstName: string, lastName: string, gender?: GenderEnum | null, birthdate?: any | null, city: string, address1: string, address2?: string | null, zipCode: string, phone: string, emergencyContactName: string, emergencyContactPhone: string, emergencyContactRelationship?: string | null, hideMetrics?: boolean | null, weight?: number | null, leaderboardUsername?: string | null, country: { __typename?: 'Country', name: string, code: string, states?: Array<{ __typename?: 'State', name: string, code: string } | null> | null }, state?: { __typename?: 'State', name: string, code: string } | null } | null };

export type CurrentUserWorkoutStatsQueryVariables = Exact<{
  site: SiteEnum;
}>;


export type CurrentUserWorkoutStatsQuery = { __typename?: 'Query', currentUserWorkoutStats: Array<{ __typename?: 'ClassStat', classId: string, className?: string | null, startDateTime: any, spotNumber?: number | null, averagePower?: number | null, highPower?: number | null, averageRpm?: number | null, highRpm?: number | null, totalEnergy?: number | null, calories?: number | null, distance?: number | null, duration?: number | null, adjustedChartPoints: Array<{ __typename?: 'ChartPoint', time?: number | null, rpm?: number | null, power?: number | null }> } | null> };

export type CurrentUserEnrollmentsQueryVariables = Exact<{
  site: SiteEnum;
  params?: InputMaybe<CurrentUserEnrollmentsParams>;
}>;


export type CurrentUserEnrollmentsQuery = { __typename?: 'Query', currentUserEnrollments: Array<{ __typename?: 'Enrollment', enrollmentInfo: { __typename?: 'EnrollmentInfo', id: string, enrollmentStatus: EnrollmentStatusEnum, enrollmentDateTime: any, spotInfo?: { __typename?: 'SpotInfo', spotNumber: number, isBooked: boolean } | null }, class: { __typename?: 'Class', id: string, name: string, description: string, instructorName: string, start: any, startWithNoTimeZone: any, duration: number, waitListAvailable: boolean } }> };

export type CurrentUserPurchasesQueryVariables = Exact<{
  site: SiteEnum;
}>;


export type CurrentUserPurchasesQuery = { __typename?: 'Query', currentUserPurchases?: Array<{ __typename?: 'Purchase', packageName: string, allowanceObtained: number, allowanceRemaining: number, paymentDateTime: any, activationDateTime: any, expirationDateTime: any } | null> | null };

export type CountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CountriesQuery = { __typename?: 'Query', countries?: Array<{ __typename?: 'Country', name: string, code: string } | null> | null };

export type CountryQueryVariables = Exact<{
  countryCode: Scalars['String'];
}>;


export type CountryQuery = { __typename?: 'Query', country?: { __typename?: 'Country', name: string, code: string, states?: Array<{ __typename?: 'State', name: string, code: string } | null> | null } | null };

export type CalendarClassesQueryVariables = Exact<{
  site: SiteEnum;
  params?: InputMaybe<CalendarClassesParams>;
}>;


export type CalendarClassesQuery = { __typename?: 'Query', calendarClasses: Array<{ __typename?: 'Class', id: string, name: string, description: string, instructorName: string, start: any, startWithNoTimeZone: any, duration: number, waitListAvailable: boolean }> };

export type CustomCalendarClassesQueryVariables = Exact<{
  site: SiteEnum;
  params?: InputMaybe<CalendarClassesParams>;
  enrollmentsWaitlistParams?: InputMaybe<CurrentUserEnrollmentsParams>;
  enrollmentsUpcomingParams?: InputMaybe<CurrentUserEnrollmentsParams>;
}>;


export type CustomCalendarClassesQuery = { __typename?: 'Query', siteSettings: { __typename?: 'SiteSetting', siteDateTimeNow?: any | null }, calendarClasses: Array<{ __typename?: 'Class', id: string, name: string, description: string, instructorName: string, start: any, startWithNoTimeZone: any, duration: number, waitListAvailable: boolean }>, enrollmentsWaitlist: Array<{ __typename?: 'Enrollment', enrollmentInfo: { __typename?: 'EnrollmentInfo', id: string, enrollmentStatus: EnrollmentStatusEnum, enrollmentDateTime: any }, class: { __typename?: 'Class', id: string, name: string, description: string, instructorName: string, isSubstitute: boolean, start: any, startWithNoTimeZone: any, duration: number, waitListAvailable: boolean } }>, enrollmentsUpcoming: Array<{ __typename?: 'Enrollment', enrollmentInfo: { __typename?: 'EnrollmentInfo', id: string, enrollmentStatus: EnrollmentStatusEnum, enrollmentDateTime: any }, class: { __typename?: 'Class', id: string, name: string, description: string, instructorName: string, isSubstitute: boolean, start: any, startWithNoTimeZone: any, duration: number, waitListAvailable: boolean } }> };

export type ClassInfoQueryVariables = Exact<{
  site: SiteEnum;
  id: Scalars['ID'];
}>;


export type ClassInfoQuery = { __typename?: 'Query', classInfo?: { __typename?: 'ClassInfo', class: { __typename?: 'Class', id: string, name: string, description: string, instructorName: string, start: any, startWithNoTimeZone: any, duration: number, waitListAvailable: boolean }, matrix?: Array<{ __typename: 'BookableSpot', x: number, y: number, icon: PositionIconEnum, spotInfo: { __typename?: 'SpotInfo', spotNumber: number, isBooked: boolean } } | { __typename: 'IconPosition', x: number, y: number, icon: PositionIconEnum }> | null } | null };

export type RegisterUserMutationVariables = Exact<{
  site: SiteEnum;
  input: RegisterUserInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser?: { __typename?: 'User', email: string } | null };

export type UpdateCurrentUserMutationVariables = Exact<{
  input: UserInput;
}>;


export type UpdateCurrentUserMutation = { __typename?: 'Mutation', updateCurrentUser?: { __typename?: 'User', email: string } | null };

export type BookClassMutationVariables = Exact<{
  site: SiteEnum;
  input: BookClassInput;
}>;


export type BookClassMutation = { __typename?: 'Mutation', bookClass: { __typename: 'AddedToWaitlistSuccess' } | { __typename: 'BookClassSuccess' } | { __typename: 'BookedButInOtherSpotError' } | { __typename: 'ClassIsFullError' } | { __typename: 'ClientIsAlreadyBookedError' } | { __typename: 'ClientIsAlreadyOnWaitlistError' } | { __typename: 'ClientIsOutsideSchedulingWindowError' } | { __typename: 'PaymentRequiredError' } | { __typename: 'SpotAlreadyReservedError' } | { __typename: 'UnknownError' } | { __typename: 'WaitlistFullError' } };


export const CurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"birthdate"}},{"kind":"Field","name":{"kind":"Name","value":"country"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"states"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"state"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}},{"kind":"Field","name":{"kind":"Name","value":"city"}},{"kind":"Field","name":{"kind":"Name","value":"address1"}},{"kind":"Field","name":{"kind":"Name","value":"address2"}},{"kind":"Field","name":{"kind":"Name","value":"zipCode"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"emergencyContactName"}},{"kind":"Field","name":{"kind":"Name","value":"emergencyContactPhone"}},{"kind":"Field","name":{"kind":"Name","value":"emergencyContactRelationship"}},{"kind":"Field","name":{"kind":"Name","value":"hideMetrics"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}},{"kind":"Field","name":{"kind":"Name","value":"leaderboardUsername"}}]}}]}}]} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const CurrentUserWorkoutStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"currentUserWorkoutStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"site"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteEnum"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUserWorkoutStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"site"},"value":{"kind":"Variable","name":{"kind":"Name","value":"site"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classId"}},{"kind":"Field","name":{"kind":"Name","value":"className"}},{"kind":"Field","name":{"kind":"Name","value":"startDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"spotNumber"}},{"kind":"Field","name":{"kind":"Name","value":"averagePower"}},{"kind":"Field","name":{"kind":"Name","value":"highPower"}},{"kind":"Field","name":{"kind":"Name","value":"averageRpm"}},{"kind":"Field","name":{"kind":"Name","value":"highRpm"}},{"kind":"Field","name":{"kind":"Name","value":"totalEnergy"}},{"kind":"Field","name":{"kind":"Name","value":"calories"}},{"kind":"Field","name":{"kind":"Name","value":"distance"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"adjustedChartPoints"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"amountOfPoints"},"value":{"kind":"IntValue","value":"62"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"time"}},{"kind":"Field","name":{"kind":"Name","value":"rpm"}},{"kind":"Field","name":{"kind":"Name","value":"power"}}]}}]}}]}}]} as unknown as DocumentNode<CurrentUserWorkoutStatsQuery, CurrentUserWorkoutStatsQueryVariables>;
export const CurrentUserEnrollmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"currentUserEnrollments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"site"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteEnum"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CurrentUserEnrollmentsParams"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUserEnrollments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"site"},"value":{"kind":"Variable","name":{"kind":"Name","value":"site"}}},{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollmentInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"spotInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spotNumber"}},{"kind":"Field","name":{"kind":"Name","value":"isBooked"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"class"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"instructorName"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"startWithNoTimeZone"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"waitListAvailable"}}]}}]}}]}}]} as unknown as DocumentNode<CurrentUserEnrollmentsQuery, CurrentUserEnrollmentsQueryVariables>;
export const CurrentUserPurchasesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"currentUserPurchases"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"site"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteEnum"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUserPurchases"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"site"},"value":{"kind":"Variable","name":{"kind":"Name","value":"site"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"packageName"}},{"kind":"Field","name":{"kind":"Name","value":"allowanceObtained"}},{"kind":"Field","name":{"kind":"Name","value":"allowanceRemaining"}},{"kind":"Field","name":{"kind":"Name","value":"paymentDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"activationDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDateTime"}}]}}]}}]} as unknown as DocumentNode<CurrentUserPurchasesQuery, CurrentUserPurchasesQueryVariables>;
export const CountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<CountriesQuery, CountriesQueryVariables>;
export const CountryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"country"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"countryCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"country"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"countryCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"countryCode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"states"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<CountryQuery, CountryQueryVariables>;
export const CalendarClassesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"calendarClasses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"site"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteEnum"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarClassesParams"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarClasses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"site"},"value":{"kind":"Variable","name":{"kind":"Name","value":"site"}}},{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"instructorName"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"startWithNoTimeZone"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"waitListAvailable"}}]}}]}}]} as unknown as DocumentNode<CalendarClassesQuery, CalendarClassesQueryVariables>;
export const CustomCalendarClassesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"customCalendarClasses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"site"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteEnum"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CalendarClassesParams"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentsWaitlistParams"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CurrentUserEnrollmentsParams"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentsUpcomingParams"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CurrentUserEnrollmentsParams"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"site"},"value":{"kind":"Variable","name":{"kind":"Name","value":"site"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteDateTimeNow"}}]}},{"kind":"Field","name":{"kind":"Name","value":"calendarClasses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"site"},"value":{"kind":"Variable","name":{"kind":"Name","value":"site"}}},{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"instructorName"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"startWithNoTimeZone"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"waitListAvailable"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"enrollmentsWaitlist"},"name":{"kind":"Name","value":"currentUserEnrollments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"site"},"value":{"kind":"Variable","name":{"kind":"Name","value":"site"}}},{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentsWaitlistParams"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollmentInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentDateTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"class"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"instructorName"}},{"kind":"Field","name":{"kind":"Name","value":"isSubstitute"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"startWithNoTimeZone"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"waitListAvailable"}}]}}]}},{"kind":"Field","alias":{"kind":"Name","value":"enrollmentsUpcoming"},"name":{"kind":"Name","value":"currentUserEnrollments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"site"},"value":{"kind":"Variable","name":{"kind":"Name","value":"site"}}},{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentsUpcomingParams"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollmentInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentStatus"}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentDateTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"class"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"instructorName"}},{"kind":"Field","name":{"kind":"Name","value":"isSubstitute"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"startWithNoTimeZone"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"waitListAvailable"}}]}}]}}]}}]} as unknown as DocumentNode<CustomCalendarClassesQuery, CustomCalendarClassesQueryVariables>;
export const ClassInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"classInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"site"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteEnum"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"site"},"value":{"kind":"Variable","name":{"kind":"Name","value":"site"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"class"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"instructorName"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"startWithNoTimeZone"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"waitListAvailable"}}]}},{"kind":"Field","name":{"kind":"Name","value":"matrix"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"x"}},{"kind":"Field","name":{"kind":"Name","value":"y"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BookableSpot"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spotInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"spotNumber"}},{"kind":"Field","name":{"kind":"Name","value":"isBooked"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ClassInfoQuery, ClassInfoQueryVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"registerUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"site"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteEnum"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"site"},"value":{"kind":"Variable","name":{"kind":"Name","value":"site"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const UpdateCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCurrentUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCurrentUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<UpdateCurrentUserMutation, UpdateCurrentUserMutationVariables>;
export const BookClassDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"bookClass"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"site"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SiteEnum"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BookClassInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bookClass"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"site"},"value":{"kind":"Variable","name":{"kind":"Name","value":"site"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<BookClassMutation, BookClassMutationVariables>;