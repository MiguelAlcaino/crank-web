import {gql} from "@apollo/client";
import type {
    BookClassInput,
    CalendarClassesParams, CancelEnrollmentInput,
    Class,
    ClassInfo,
    ClassStat,
    Country,
    CurrentUserEnrollmentsParams,
    Enrollment,
    Purchase,
    RegisterUserInput, RemoveCurrentUserFromWaitlistInput,
    SiteEnum,
    User,
    UserInput
} from "@/gql/graphql";
import {EnrollmentTypeEnum, type SiteSetting} from "@/gql/graphql";
import {ApolloClient, ApolloError} from "@apollo/client/core";
import {CustomCalendarClasses} from "@/model/CustomCalendarClasses";
import dayjs from "dayjs";

export class ApiService{
    authApiClient: ApolloClient<any>
    anonymousApiClient: ApolloClient<any>
    constructor(authApiClient: ApolloClient<any>, anonymousApiClient: ApolloClient<any>) {
        this.authApiClient = authApiClient;
        this.anonymousApiClient = anonymousApiClient;
    }

    async getSiteSettings(site: SiteEnum): Promise<SiteSetting | null> {
        const SITE_SETTING_QUERY = gql`
       query siteSettings($site: SiteEnum!){
            siteSettings(site: $site) {
              siteDateTimeNow
            }
          }
    `;
        try {
            const queryResult = await this.authApiClient.query({
                query: SITE_SETTING_QUERY,
                variables: {
                    site: site,
                },
                fetchPolicy: 'network-only'
            });

            return queryResult.data.siteSettings as SiteSetting;
        } catch (error) {
            return null;
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
                  states{
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
    `;
        try {
            const queryResult = await this.authApiClient.query({
                query: CURRENT_USER_QUERY
            });

            return queryResult.data.currentUser as User;
        } catch (error) {
            return null;
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
    `;
        try {
            const queryResult = await this.authApiClient.query({
                query: CURRENT_USER_WORKOUT_STATS_QUERY,
                variables: {
                    site: site,
                },
            });

            return queryResult.data.currentUserWorkoutStats as ClassStat;
        } catch (error) {
            return null;
        }
    }
    async getCurrentUserEnrollments(site: SiteEnum, params: CurrentUserEnrollmentsParams): Promise<Enrollment[]> {
        const CURRENT_USER_ENROLLMENTS_QUERY = gql`
              query currentUserEnrollments($site: SiteEnum!, $params: CurrentUserEnrollmentsParams) {
                currentUserEnrollments(site: $site, params: $params) {          
                        enrollmentInfo {
                          id
                          enrollmentStatus
                          enrollmentDateTime
                          spotInfo{
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
            `;
        try {
            const queryResult = await this.authApiClient.query({
                query: CURRENT_USER_ENROLLMENTS_QUERY,
                variables: {
                    site: site,
                    params: params
                },
                fetchPolicy: 'network-only'
            });

            return queryResult.data.currentUserEnrollments as Enrollment[];
        } catch (error) {
            return [];
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
            `;
        try {
            const queryResult = await this.authApiClient.query({
                query: CURRENT_USER_PURCHASES_QUERY,
                variables: {
                    site: site,
                },
            });

            return queryResult.data.currentUserPurchases as Purchase[];
        } catch (error) {
            return [];
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
    `;
        try {
            const queryResult = await this.anonymousApiClient.query({
                query: COUNTRIES_QUERY
            });

            return queryResult.data.countries as Country[];
        } catch (error) {
            return [];
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
    `;
        try {
            const queryResult = await this.anonymousApiClient.query({
                query: COUNTRY_QUERY,
                variables: {
                    countryCode: countryCode,
                },
            });

            return queryResult.data.country as Country;
        } catch (error) {
            return null;
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
                `;
        try {
            const stgStartDate = dayjs(startDate).format("YYYY-MM-DD");
            const stgEndDate = dayjs(endDate).format("YYYY-MM-DD");

            const params: CalendarClassesParams = {
                startDate: stgStartDate,
                endDate: stgEndDate,
            };

            const queryResult = await this.authApiClient.query({
                query: CALENDAR_CLASSES_QUERY,
                variables: {
                    site: site,
                    params: params
                }
            });

            return queryResult.data.calendarClasses as Class[];
        } catch (error) {
            return [];
        }
    }
    async getCustomCalendarClasses(site: SiteEnum, startDate: Date, endDate: Date): Promise<CustomCalendarClasses | null> {
        const CUSTOM_CALENDAR_CLASSES_QUERY = gql`
                  query customCalendarClasses($site: SiteEnum!, 
                                        $params: CalendarClassesParams, 
                                        $enrollmentsWaitlistParams: CurrentUserEnrollmentsParams, 
                                        $enrollmentsUpcomingParams: CurrentUserEnrollmentsParams) {
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
                    }
                    enrollmentsWaitlist:
                        currentUserEnrollments(site: $site, params: $enrollmentsWaitlistParams) {
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
                        enrollmentsUpcoming:
                            currentUserEnrollments(site: $site, params: $enrollmentsUpcomingParams) {
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
                `;

        const stgStartDate = dayjs(startDate).format("YYYY-MM-DD");
        const stgEndDate = dayjs(endDate).format("YYYY-MM-DD");

        const params: CalendarClassesParams = {
            startDate: stgStartDate,
            endDate: stgEndDate,
        };

        const enrollmentsWaitlistParams: CurrentUserEnrollmentsParams = {
            enrollmentType: EnrollmentTypeEnum.Waitlist,
            startDate: stgStartDate,
            endDate: stgEndDate,
        };

        const enrollmentsUpcomingParams: CurrentUserEnrollmentsParams = {
            enrollmentType: EnrollmentTypeEnum.Upcoming,
            startDate: stgStartDate,
            endDate: stgEndDate
        };

        try {
            const queryResult = await this.authApiClient.query({
                query: CUSTOM_CALENDAR_CLASSES_QUERY,
                variables: {
                    site: site,
                    params: params,
                    enrollmentsWaitlistParams: enrollmentsWaitlistParams,
                    enrollmentsUpcomingParams: enrollmentsUpcomingParams,
                }
            });

            const siteSettings = queryResult.data.siteSettings as SiteSetting;
            const calendarClasses = queryResult.data.calendarClasses as Class[];
            const enrollmentsWaitlist = queryResult.data.enrollmentsWaitlist as Enrollment[];
            const enrollmentsUpcoming = queryResult.data.enrollmentsUpcoming as Enrollment[];

            return new CustomCalendarClasses(siteSettings, calendarClasses, enrollmentsWaitlist, enrollmentsUpcoming);
        } catch (error) {
            return null;
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
                          matrix{
                            __typename
                            x
                            y
                            icon
                            ... on BookableSpot{
                              spotInfo{
                                spotNumber
                                isBooked
                              }
                            } 
                          }
                }
              }
            `;
        try {
            const queryResult = await this.authApiClient.query({
                query: CLASS_INFO_QUERY,
                variables: {
                    site: site,
                    id: id,
                },
            });

            return queryResult.data.classInfo as ClassInfo;
        } catch (error) {
            return null;
        }
    }
    async registerUser(site: SiteEnum, input: RegisterUserInput): Promise<string> {
        const REGISTER_USER_MUTATION = gql`
              mutation registerUser($site: SiteEnum!, $input: RegisterUserInput!) {
                registerUser(site: $site, input: $input) {
                  email
                }
              }
            `;

        try {
            await this.anonymousApiClient.mutate({
                mutation: REGISTER_USER_MUTATION,
                variables: {
                    site: site,
                    input: input,
                },
            });
            return "SuccessRegistration";
        } catch (error) {
            if (error instanceof ApolloError) {
                if (error.graphQLErrors[0].message === 'register.user_already_registered') {
                    return "RegisterUserAlreadyRegisteredException";
                } else if (error.graphQLErrors[0].message === 'minimum_password_length_is_four_chars') {
                    return "MinimumPasswordLengthException";
                } else if (error.graphQLErrors[0].message === 'password_must_contain_letter_or_number') {
                    return "PasswordMustContainLetterOrNumberException";
                } else {
                    return "UnknownError";
                }
            } else {
                return "UnknownError";
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
            `;

        try {
            await this.authApiClient.mutate({
                mutation: UPDATE_CURRENT_USER_MUTATION,
                variables: {
                    input: input,
                },
            });
            return "UpdateProfileSuccess";
        } catch (error) {
            return "UnknownError";
        }
    }
    async bookClass(site: SiteEnum, input: BookClassInput): Promise<string> {
        const BOOK_CLASS_MUTATION = gql`
              mutation bookClass($site: SiteEnum!, $input: BookClassInput!) {
                bookClass(site: $site, input: $input) {
                  __typename
                }
              }
            `;

        try {
            const result = await this.authApiClient.mutate({
                mutation: BOOK_CLASS_MUTATION,
                variables: {
                    site: site,
                    input: input,
                },
            });

            return result.data.bookClass.__typename;
        } catch (error) {
            return "UnknownError";
        }
    }
    async cancelCurrentUserEnrollment(site: SiteEnum, input: CancelEnrollmentInput): Promise<string> {
        const CANCEL_CURRENT_USER_ENROLLMENT_MUTATION = gql`
              mutation cancelCurrentUserEnrollment($site: SiteEnum!, $input: CancelEnrollmentInput!) {
                cancelCurrentUserEnrollment(site: $site, input: $input) {
                  __typename
                }
              }
            `;

        try {
            const result = await this.authApiClient.mutate({
                mutation: CANCEL_CURRENT_USER_ENROLLMENT_MUTATION,
                variables: {
                    site: site,
                    input: input,
                },
                fetchPolicy: 'network-only'
            });

            return result.data.cancelCurrentUserEnrollment.__typename;
        } catch (error) {
            return "UnknownError";
        }
    }
    async removeCurrentUserFromWaitlist(site: SiteEnum, input: RemoveCurrentUserFromWaitlistInput): Promise<any> {
        const REMOVE_CURRENT_USER_FROM_WAITLIST_MUTATION = gql`
              mutation removeCurrentUserFromWaitlist($site: SiteEnum!, $input: RemoveCurrentUserFromWaitlistInput!) {
                removeCurrentUserFromWaitlist(site: $site, input: $input) {
                    ... on RemoveFromWaitlistResult{
                      success
                    }
                    ... on WaitlistEntryNotFoundError{
                      code
                    }
                }
              }
            `;

        try {
            const result = await this.authApiClient.mutate({
                mutation: REMOVE_CURRENT_USER_FROM_WAITLIST_MUTATION,
                variables: {
                    site: site,
                    input: input,
                },
                fetchPolicy: 'network-only'
            });

            return result.data.removeCurrentUserFromWaitlist;
        } catch (error) {
            return {"__typename": "UnknownError"};
        }
    }
}
