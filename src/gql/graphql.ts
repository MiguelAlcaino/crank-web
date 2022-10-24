/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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

export type AddedToWaitlistSuccess = {
  __typename?: 'AddedToWaitlistSuccess';
  status: Scalars['Boolean'];
};

export type BookClassInput = {
  classId: Scalars['ID'];
  isWaitlistBooking?: InputMaybe<Scalars['Boolean']>;
  spotNumber?: InputMaybe<Scalars['Int']>;
};

export type BookClassResultUnion = AddedToWaitlistSuccess | BookClassSuccess | BookedButInOtherSpotError | ClassIsFullError | ClientIsAlreadyBookedError | ClientIsOutsideSchedulingWindowError | PaymentRequiredError | SpotAlreadyReservedError | UnknownError | WaitlistFullError;

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

export type CancelEnrollmentResultUnion = CancelUserEnrollmentSuccess | LateCancellationRequiredError;

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

export type EditEnrollmentResultUnion = Enrollment;

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
  /** Request a reset password link */
  requestPasswordLink?: Maybe<ResetPasswordLinkResultUnion>;
  /** Updates the current user */
  updateCurrentUser?: Maybe<User>;
  /** Updates a user's password in all the sites */
  updateCurrentUserPassword?: Maybe<Scalars['Boolean']>;
  /** Validates a reset password token */
  validateResetPasswordToken?: Maybe<ValidateResetPasswordTokenResultUnion>;
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


export type MutationRequestPasswordLinkArgs = {
  input?: InputMaybe<RequestPasswordLinkInput>;
  site: SiteEnum;
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

/** Error returned when a client does not have enough credit or allowance to book a class */
export type PaymentRequiredError = Error & {
  __typename?: 'PaymentRequiredError';
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

export type RequestPasswordLinkInput = {
  email: Scalars['String'];
};

export type ResetPasswordLinkResultUnion = ResetPasswordLinkSentSuccessfully | TooManyResetPasswordLinkRequestsError;

export type ResetPasswordLinkSentSuccessfully = {
  __typename?: 'ResetPasswordLinkSentSuccessfully';
  status: Scalars['Boolean'];
};

export type ResetPasswordTokenValid = {
  __typename?: 'ResetPasswordTokenValid';
  accessToken: Scalars['String'];
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

export type WaitlistFullError = Error & {
  __typename?: 'WaitlistFullError';
  code: Scalars['String'];
};

export type CountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CountriesQuery = { __typename?: 'Query', countries?: Array<{ __typename?: 'Country', name: string, code: string } | null> | null };


export const CountriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"countries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]} as unknown as DocumentNode<CountriesQuery, CountriesQueryVariables>;