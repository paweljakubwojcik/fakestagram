import { GradientsProvider } from "components/gradients-provider"
import { Layout } from "components/layout"
import { useProgressBar } from "hooks/use-progress-bar"
import Head from "next/head"
import { AppPropsWithLayout } from "types"
import "../styles/globals.css"
import "../styles/nprogress.css"

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    useProgressBar()

    return (
        <>
            <Head>
                <title>Fakestagram</title>
                <meta name="description" content="fakestagram is a fake place for your photoshoped photos" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <GradientsProvider />
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}

export default MyApp
