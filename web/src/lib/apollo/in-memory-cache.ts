import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { relayStylePagination } from "@apollo/client/utilities"

export const inMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        posts: relayStylePagination(["id"]),
      },
    },
  },
})
