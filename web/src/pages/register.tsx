import { Form, Formik, FormikConfig, FormikProps } from "formik"
import type { NextPage } from "next"
import Head from "next/head"
import { Button } from "components/buttons/button"
import { Card } from "components/card"
import { InputField } from "components/input-field"
import { withApollo } from "lib/apollo"
import { MeDocument, useRegisterMutation } from "@graphql"
import { ErrorBox } from "components/error-box"
import { credentials } from "@fakestagram/common/validators"
import * as yup from "yup"
import Link from "next/link"
import { useRouter } from "next/router"
import { publicOnlyPage } from "components/public-only-page"

const registerValidation = credentials.shape({
  confirmPassword: yup
    .string()
    .default("")
    .required()
    .test("same-as-password", "Passwords do not match", (value, context) => value === context.parent.password)
    .label("Confirm password"),
})

type RegisterFormValues = yup.InferType<typeof registerValidation>

const initialValues = registerValidation.getDefault()

const Register: NextPage = () => {
  const router = useRouter()
  const [register, { error }] = useRegisterMutation({
    update: (cache, { data }) => {
      cache.writeQuery({
        query: MeDocument,
        data: {
          me: data?.register,
        },
      })
    },
  })

  const onSubmit: FormikConfig<RegisterFormValues>["onSubmit"] = async ({ username, password }, { setErrors }) => {
    await register({
      variables: {
        username,
        password,
      },
    })
    router.push("/")
  }

  return (
    <main className="h-screen w-full flex items-center justify-center ">
      <Head>
        <title>Register | Fakestagram</title>
      </Head>
      <div className="w-full max-w-[360px]">
        <Formik onSubmit={onSubmit} initialValues={initialValues} validationSchema={registerValidation}>
          {({ isValid, isSubmitting }: FormikProps<RegisterFormValues>) => (
            <Card component={Form} className="p-8 dark:bg-gray-800">
              <h1 className="text-lg mx-auto">Register to fakestagram</h1>
              <div className="flex flex-col space-y-2 my-4">
                <InputField name="username" label="Username" />
                <InputField name="password" type="password" label="Password" />
                <InputField name="confirmPassword" type="password" label="Confirm password" />
                {error && <ErrorBox>{error.message}</ErrorBox>}
              </div>
              <Button type="submit" mode="primary" disabled={!isValid} loading={isSubmitting}>
                Register
              </Button>
              <div className="flex items-center my-6">
                <span className="block flex-1 h-[1px] bg-gray-200" />
                <span className="mx-4 text-gray-400">OR</span>
                <span className="block flex-1 h-[1px] bg-gray-200" />
              </div>
              <Button mode="secondary" className="!text-xs">
                Log in with github
              </Button>
            </Card>
          )}
        </Formik>

        <Card className="py-6 dark:bg-gray-800">
          <div className="text-center">
            Already have an account?{" "}
            <Link href={"/login"}>
              <a className="text-primary">Log in</a>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  )
}

export default withApollo(publicOnlyPage(Register))
