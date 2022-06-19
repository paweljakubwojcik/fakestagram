import nextWithApollo from "next-with-apollo"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { getDataFromTree } from "@apollo/client/react/ssr"
import { config } from "./apollo-client.config"
import { inMemoryCache } from "./in-memory-cache"

type WithApolloParams = Parameters<ReturnType<typeof nextWithApollo>>
type NextPageComp = WithApolloParams[0]
type WithApolloOptions = Omit<NonNullable<WithApolloParams[1]>, "getDataFromTree"> & { ssr?: boolean }

const withApollo = (Comp: NextPageComp, { ssr, ...options }: WithApolloOptions = {}) =>
  nextWithApollo(
    ({ initialState }) => {
      return new ApolloClient({
        cache: inMemoryCache.restore(initialState || {}),
        ...config,
      })
    },
    {
      render: ({ Page, props }) => {
        return (
          <ApolloProvider client={props.apollo}>
            <Page {...props} />
          </ApolloProvider>
        )
      },
    }
  )(Comp, { ...options, getDataFromTree: ssr ? getDataFromTree : undefined })

export { withApollo }
