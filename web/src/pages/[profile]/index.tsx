import { Navbar } from "components/navbar"
import { SplashScreen } from "components/splash-screen"
import { useAuth } from "hooks/use-auth"
import { addApolloState, initializeApollo } from "lib/apollo/client"
import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"

const Profile: NextPage = () => {
    const router = useRouter()
    const { profile } = router.query

    const { me, loading, logout } = useAuth()

    if (loading) {
        return <SplashScreen />
    }

    return (
        <>
            <Head>
                <title>{profile} | Fakestagram</title>
            </Head>
            <Navbar />
            <main className="max-w-main-content mx-auto">
                


            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: "blocking",
    }
}

export const getStaticProps: GetStaticProps = async () => {
    const apolloClient = initializeApollo()

    // apolloClient.query({})

    return addApolloState(apolloClient, {
        props: {},
        revalidate: 60,
    })
}

export default Profile
