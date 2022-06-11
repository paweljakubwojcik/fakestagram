import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { relayStylePagination } from "@apollo/client/utilities"
import { PostConnection } from "@graphql"

export const inMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        posts: relayStylePagination(["id"]),
      },
    },
  },
})
