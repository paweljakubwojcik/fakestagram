import { ApolloProvider } from "@apollo/client"
import { GradientsProvider } from "components/gradients-provider"
import { Layout } from "components/layout"
import { useProgressBar } from "hooks/use-progress-bar"
import { useApollo } from "lib/apollo/client"
import Head from "next/head"
import { AppPropsWithLayout } from "types"
import "../styles/globals.css"
import "../styles/nprogress.css"

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    useProgressBar()

    const apolloClient = useApollo(pageProps) // rehydracja graphql cache

    return (
        <ApolloProvider client={apolloClient}>
            <Head>
                <title>Fakestagram</title>
                <meta name="description" content="fakestagram is a fake place for your fake photos" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <GradientsProvider />
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ApolloProvider>
    )
}

export default MyApp
