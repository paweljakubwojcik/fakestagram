import { authPage } from "components/auth-page"
import { Navbar } from "components/navbar"
import type { NextPage } from "next"
import Head from "next/head"

const Likes: NextPage = () => {
  return (
    <>
      <Head>
        <title>Likes | Fakestagram</title>
      </Head>
      <Navbar />
      <main className="max-w-main-content mx-auto">Direct</main>
    </>
  )
}

export default authPage(Likes)
