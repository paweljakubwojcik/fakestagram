import { ApolloClient } from "@apollo/client"
import merge from "deepmerge"
import { GetServerSidePropsResult, GetStaticPropsResult } from "next"
import { equals } from "ramda"
import { useMemo } from "react"
import { config } from "./apollo-client.config"

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__"

let apolloClient: ApolloClient<any>

function createApolloClient() {
    return new ApolloClient({
        ssrMode: typeof window === "undefined",
        ...config,
    })
}

export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient()

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // gets hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract()

        // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
        const data = merge(existingCache, initialState, {
            // combine arrays using object equality (like in sets)
            arrayMerge: (destinationArray, sourceArray) => [
                ...sourceArray,
                ...destinationArray.filter((d) => sourceArray.every((s) => !equals(d, s))),
            ],
        })

        // Restore the cache with the merged data
        _apolloClient.cache.restore(data)
    }
    // For SSG and SSR always create a new Apollo Client
    if (typeof window === "undefined") return _apolloClient
    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}

/**
 * przekazanie propsów we własciwy w metodach getStaticProps getServerSideProps
 *  @link https://github.com/vercel/next.js/blob/canary/examples/with-apollo/pages/ssr.js
 */
export function addApolloState<P extends object>(
    client: ApolloClient<any>,
    pageProps: GetStaticPropsResult<P> | GetServerSidePropsResult<P>
): GetStaticPropsResult<P> | GetServerSidePropsResult<P> {
    if ("props" in pageProps) {
        Object.assign(pageProps.props, { [APOLLO_STATE_PROP_NAME]: client.cache.extract() })
    }

    return pageProps
}

export function useApollo(pageProps: any = {}) {
    const state = pageProps[APOLLO_STATE_PROP_NAME]
    const store = useMemo(() => initializeApollo(state), [state])
    return store
}
