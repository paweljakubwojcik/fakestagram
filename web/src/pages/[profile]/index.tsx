import { withApollo } from "lib/apollo"
import type { NextPage } from "next"
import Head from "next/head"
import { Navbar } from "components/navbar"
import { useRouter } from "next/router"
import { useAuth } from "hooks/use-auth"
import { SplashScreen } from "components/splash-screen"

const Profile: NextPage = () => {
  const router = useRouter()
  const { profile } = router.query

  const { me, loading, logout } = useAuth()

 /*  if (loading) {
    return <SplashScreen />
  } */

  return (
    <>
      <Head>
        <title>{profile} | Fakestagram</title>
      </Head>
      <Navbar />
      <main className="max-w-main-content mx-auto">{profile}`s` profile</main>
    </>
  )
}

export default withApollo(Profile)
