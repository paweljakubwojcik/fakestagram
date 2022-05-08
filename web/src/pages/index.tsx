import { withApollo } from "lib/apollo"
import type { NextPage } from "next"
import Head from "next/head"
import { Navbar } from "components/navbar"

const Home: NextPage = () => {

  return (
    <div className="h-screen w-full bg-gray-50 text-xs">
      <Head>
        <title>Home | Fakestagram</title>
      </Head>
      <Navbar />
      <main className="max-w-main-content mx-auto">Siemaneczko</main>
    </div>
  )
}

export default withApollo(Home)
