import { createHttpLink, Observable } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { useAuthenticationStore } from '@/stores/authToken'
import { onError } from '@apollo/client/link/error'
import { authService } from '@/services/authService'

function newAnonymousClient(gqlUrl: string): ApolloClient<any> {
  const httpLink2 = createHttpLink({
    uri: gqlUrl
  })

  return new ApolloClient({
    link: httpLink2,
    cache: new InMemoryCache()
  })
}

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = useAuthenticationStore().token
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      switch (err.message) {
        case 'jwt.expired_access_token':
          return new Observable<any>((observer) => {
            // used an annonymous function for using an async function
            ;(async () => {
              try {
                await authService.refreshToken()
                // Retry the failed request
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer)
                }

                forward(operation).subscribe(subscriber)
              } catch (err) {
                observer.error(err)
              }
            })()
          })
      }
    }
  }

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

function newAuthenticatedApolloClient(gqlUrl: string): ApolloClient<any> {
  const httpLink2 = createHttpLink({
    uri: gqlUrl
  })
  return new ApolloClient({
    link: authLink.concat(errorLink).concat(httpLink2),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            currentUserEnrollments: {
              merge: false
            }
          }
        }
      }
    })
  })
}

export { newAuthenticatedApolloClient, newAnonymousClient }
