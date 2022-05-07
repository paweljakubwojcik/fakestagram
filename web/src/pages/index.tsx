import { useMeQuery } from "@graphql"
import { withApollo } from "lib/apollo"
import type { NextPage } from "next"
import Head from "next/head"

const Home: NextPage = () => {
  const { data: { me } = {} } = useMeQuery()

  return (
    <main className="h-screen w-full flex items-center justify-center bg-gray-50 text-xs">
      <Head>
        <title>Home | Fakestagram</title>
      </Head>
      Siemaneczko {me?.username}
    </main>
  )
}

export default withApollo(Home)
