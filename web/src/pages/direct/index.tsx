import { withApollo } from "lib/apollo"
import type { NextPage } from "next"
import Head from "next/head"
import { Navbar } from "components/navbar"
import { authPage } from "components/auth-page"

const Direct: NextPage = () => {
  return (
    <>
      <Head>
        <title>Direct | Fakestagram</title>
      </Head>
      <Navbar />
      <main className="max-w-main-content mx-auto">Direct</main>
    </>
  )
}

export default withApollo(authPage(Direct))
