import { Form, Formik, FormikConfig, FormikProps } from "formik"
import type { NextPage } from "next"
import Head from "next/head"
import { Button } from "components/button"
import { Card } from "components/card"
import { InputField } from "components/input-field"
import { withApollo } from "lib/apollo"
import { useRegisterMutation } from "@graphql"
import { ErrorBox } from "components/error-box"
import { credentials, type ICredentials } from "@fakestagram/common/validators"
import * as yup from "yup"
import Link from "next/link"

type RegisterFormValues = ICredentials & {
  confirmPassword: string
}

const registerValidation = credentials.shape({
  confirmPassword: yup
    .string()
    .required()
    .test("same-as-password", "Passwords do not match", (value, context) => value === context.parent.password)
    .label("Confirm password"),
})

const initialValues = registerValidation.getDefault() as unknown as RegisterFormValues

const Register: NextPage = () => {
  const [register, { error }] = useRegisterMutation()

  const onSubmit: FormikConfig<RegisterFormValues>["onSubmit"] = async ({ username, password }, { setErrors }) => {
    await register({
      variables: {
        username,
        password,
      },
    })
  }

  return (
    <main className="h-screen w-full flex items-center justify-center bg-gray-50 text-xs">
      <Head>
        <title>Register | Fakestagram</title>
      </Head>
      <div className="w-full max-w-[360px]">
        <Formik onSubmit={onSubmit} initialValues={initialValues} validationSchema={registerValidation}>
          {({ isValid, isSubmitting }: FormikProps<RegisterFormValues>) => (
            <Card component={Form}>
              <h1 className="text-lg mx-auto">Register to fakestagram</h1>
              <div className="flex flex-col space-y-2 my-4">
                <InputField name="username" label="Username" />
                <InputField name="password" type="password" label="Password" />
                <InputField name="confirmPassword" type="password" label="Confirm password" />
                {error && <ErrorBox>{error.message}</ErrorBox>}
              </div>
              <Button type="submit" disabled={!isValid} loading={isSubmitting}>
                Register
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

export default withApollo(Register)
