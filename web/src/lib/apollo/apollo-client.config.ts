import { ApolloClientOptions, from, HttpLink, HttpOptions } from "@apollo/client"
import { onError } from "@apollo/client/link/error"
import { inMemoryCache } from "./in-memory-cache"

const errorLink = onError(({ graphQLErrors, networkError, response }) => {
    console.log(response)
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        )
    if (networkError) console.log(`[Network error]: ${networkError}`)
})

export const httpConfig: HttpOptions = {
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    credentials: "include",
}

const httpLink = new HttpLink(httpConfig)

export const config: ApolloClientOptions<any> = {
    link: from([errorLink, httpLink]),
    credentials: "include",
    connectToDevTools: process.env.NODE_ENV === "development",
    cache: inMemoryCache,
}
