import {gql, createHttpLink} from "@apollo/client";
import type {
    Country, RegisterUserInput, SiteEnum, User, ClassStat,
    CalendarClassesParams, Class, ClassInfo,
    CurrentUserEnrollmentsParams, Enrollment, Purchase
} from "@/gql/graphql";
import {ApolloClient, InMemoryCache, ApolloError} from "@apollo/client/core";
import {setContext} from '@apollo/client/link/context';
import {useAuthenticationStore} from "@/stores/authToken";

const httpLink = createHttpLink({
    uri: "/api/graphql/",
});

const apiClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

const authLink = setContext((_, {headers}) => {
    // get the authentication token from local storage if it exists
    const token = useAuthenticationStore().token;
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const authApiClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

export const apiService = {
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
            const queryResult = await authApiClient.query({
                query: CURRENT_USER_QUERY
            });

            return queryResult.data.currentUser as User;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
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
            const queryResult = await authApiClient.query({
                query: CURRENT_USER_WORKOUT_STATS_QUERY,
                variables: {
                    site: site,
                },
            });

            return queryResult.data.currentUserWorkoutStats as ClassStat;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
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
            const queryResult = await authApiClient.query({
                query: CURRENT_USER_ENROLLMENTS_QUERY,
                variables: {
                    site: site,
                    params: params
                },
            });

            return queryResult.data.currentUserEnrollments as Enrollment[];
        } catch (error) {
            console.error(error);
            return [];
        }
    },
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
            const queryResult = await authApiClient.query({
                query: CURRENT_USER_PURCHASES_QUERY,
                variables: {
                    site: site,
                },
            });

            return queryResult.data.currentUserPurchases as Purchase[];
        } catch (error) {
            console.error(error);
            return [];
        }
    },
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
            const queryResult = await apiClient.query({
                query: COUNTRIES_QUERY
            });

            return queryResult.data.countries as Country[];
        } catch (error) {
            console.error(error);
            return [];
        }
    },
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
            const queryResult = await apiClient.query({
                query: COUNTRY_QUERY,
                variables: {
                    countryCode: countryCode,
                },
            });

            return queryResult.data.country as Country;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    async getCalendarClasses(site: SiteEnum, params: CalendarClassesParams): Promise<Class[]> {
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
            const queryResult = await authApiClient.query({
                query: CALENDAR_CLASSES_QUERY,
                variables: {
                    site: site,
                    params: params
                }
            });

            return queryResult.data.calendarClasses as Class[];
        } catch (error) {
            console.error(error);
            return [];
        }
    },
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
            const queryResult = await authApiClient.query({
                query: CLASS_INFO_QUERY,
                variables: {
                    site: site,
                    id: id,
                },
            });

            return queryResult.data.classInfo as ClassInfo;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
    async registerUser(site: SiteEnum, input: RegisterUserInput): Promise<string> {
        const REGISTER_USER_MUTATION = gql`
              mutation registerUser($site: SiteEnum!, $input: RegisterUserInput!) {
                registerUser(site: $site, input: $input) {
                  email
                }
              }
            `;

        try {
            await apiClient.mutate({
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
    },
};
