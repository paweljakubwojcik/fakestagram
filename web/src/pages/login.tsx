import { Form, Formik, FormikConfig, FormikProps } from "formik"
import type { NextPage } from "next"
import Head from "next/head"
import { Button } from "components/button"
import { Card } from "components/card"
import { InputField } from "components/input-field"
import { withApollo } from "lib/apollo"
import { useLoginMutation } from "@graphql"
import { ErrorBox } from "components/error-box"
import { credentials, type ICredentials } from "@fakestagram/common/validators"

type LoginFormValues = ICredentials

const Login: NextPage = () => {
  const [login, { error }] = useLoginMutation({})

  const onSubmit: FormikConfig<LoginFormValues>["onSubmit"] = async (values, { setErrors }) => {
    await login({
      variables: values,
      onError: (e) => {
        const errors = Object.fromEntries(
          e?.graphQLErrors.map(({ message, extensions }) => [extensions.property, message]) || []
        )
        setErrors(errors)
      },
    })
  }

  console.log({ ...error })

  return (
    <main className="h-screen w-full flex items-center justify-center bg-gray-50 text-xs">
      <Head>
        <title>Zaloguj się do aplikacji | Fakestagram</title>
      </Head>
      <div className="w-full max-w-[360px]">
        <Formik
          onSubmit={onSubmit}
          initialValues={{ username: "", password: "" }}
          validateOnChange={false}
          validationSchema={credentials}
        >
          {({ isValid, isSubmitting }: FormikProps<LoginFormValues>) => (
            <Card component={Form} className="">
              <h1 className="text-lg mx-auto">Fakestagram</h1>
              <div className="flex flex-col space-y-2 my-4">
                <InputField name="username" label="Nazwa użytkownika lub email" />
                <InputField name="password" type="password" label="Hasło" />
                {error && <ErrorBox>{error.message}</ErrorBox>}
              </div>
              <Button type="submit" disabled={!isValid} loading={isSubmitting}>
                Zaloguj się
              </Button>
              <div className="flex items-center my-6">
                <span className="block flex-1 h-[1px] bg-gray-200" />
                <span className="mx-4 text-gray-400">LUB</span>
                <span className="block flex-1 h-[1px] bg-gray-200" />
              </div>
              <Button mode="inline" className="!text-xs">
                Zaloguj sie przez github
              </Button>
            </Card>
          )}
        </Formik>

        <Card className="py-6">
          <div className="text-center">
            Nie masz konta? <button className="text-primary">Zarejestruj się</button>
          </div>
        </Card>
      </div>
    </main>
  )
}

export default withApollo(Login)
