import "../styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "http://localhost:4000/graphql",
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
        <Head>
          <title>Fakestagram</title>
          <meta name="description" content="fakestagram is a fake place for your photoshoped photos" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
    </>
  )
}

export default MyApp
