import { GradientsProvider } from "components/gradients-provider"
import type { AppProps } from "next/app"
import Head from "next/head"
import "../styles/globals.css"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
        <Head>
          <title>Fakestagram</title>
          <meta name="description" content="fakestagram is a fake place for your photoshoped photos" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <GradientsProvider />
        <Component {...pageProps} />
    </>
  )
}

export default MyApp
