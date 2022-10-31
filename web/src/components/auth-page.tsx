import { useAuth } from "hooks/use-auth"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { SplashScreen } from "./splash-screen"

export const authPage = (Page: NextPage) => {
    const AuthPage = (props: any) => {
        const router = useRouter()
        const { me, loading } = useAuth()
        if (!loading && !me) {
            router.push("/login")
        }
        if (loading || !me) {
            return <SplashScreen />
        }

        return <Page {...props} />
    }

    return AuthPage
}
