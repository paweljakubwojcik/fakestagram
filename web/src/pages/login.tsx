import { Form, Formik, FormikConfig, FormikProps } from "formik"
import type { NextPage } from "next"
import Head from "next/head"
import { Button } from "components/button"
import { Card } from "components/card"
import { InputField } from "components/input-field"
import { withApollo } from "lib/apollo"
import { useLoginMutation } from "@graphql"
import { ErrorBox } from "components/error-box"
import { credentials, type CredentialsType } from "@fakestagram/common/validators"
import Link from "next/link"
import { useRouter } from "next/router"

type LoginFormValues = CredentialsType

const Login: NextPage = () => {
  const router = useRouter()
  const [login, { error }] = useLoginMutation({})

  const onSubmit: FormikConfig<LoginFormValues>["onSubmit"] = async (values) => {
    try {
      await login({
        variables: values,
      })
      router.push("/")
    } catch (e) {}
  }

  return (
    <main className="h-screen w-full flex items-center justify-center bg-gray-50 text-xs">
      <Head>
        <title>Login | Fakestagram</title>
      </Head>
      <div className="w-full max-w-[360px]">
        <Formik onSubmit={onSubmit} initialValues={credentials.getDefault()}>
          {({ isValid, isSubmitting }: FormikProps<LoginFormValues>) => (
            <Card component={Form} className="">
              <h1 className="text-lg mx-auto">Fakestagram</h1>
              <div className="flex flex-col space-y-2 my-4">
                <InputField name="username" label="Username" />
                <InputField name="password" type="Password" label="Hasło" />
                {error && <ErrorBox>{error.message}</ErrorBox>}
              </div>
              <Button type="submit" disabled={!isValid} loading={isSubmitting}>
                Login
              </Button>
              <div className="flex items-center my-6">
                <span className="block flex-1 h-[1px] bg-gray-200" />
                <span className="mx-4 text-gray-400">OR</span>
                <span className="block flex-1 h-[1px] bg-gray-200" />
              </div>
              <Button mode="inline" className="!text-xs">
                Log in with github
              </Button>
            </Card>
          )}
        </Formik>

        <Card className="py-6">
          <div className="text-center">
            {"Don't have an account?"}{" "}
            <Link href={"/register"}>
              <a className="text-primary">Register now</a>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  )
}

export default withApollo(Login)
