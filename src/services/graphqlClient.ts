import {createHttpLink} from "@apollo/client";
import {ApolloClient, InMemoryCache} from "@apollo/client/core";
import {setContext} from "@apollo/client/link/context";
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
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    currentUserEnrollments: {
                        merge: false,
                    }
                }
            }
        }
    }),
});

export {authApiClient, apiClient}