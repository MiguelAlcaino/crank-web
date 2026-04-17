declare module 'apollo-upload-client/createUploadLink.mjs' {
  import type { ApolloLink } from '@apollo/client'

  export default function createUploadLink(options: { uri: string }): ApolloLink
}
