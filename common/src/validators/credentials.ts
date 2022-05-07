import * as yup from 'yup'

export const credentials = yup.object({
    username: yup.string().label('Username').required().default('').min(3).max(16),

    password: yup
        .string()
        .label('Password')
        .required()
        .default('')
        .matches(/^(?=.*\d)/g, {
            message: 'Password must contain at least one number character',
        })
        .matches(/^(?=.*[a-z])/g, {
            message: 'Password must contain at least one lower case letter',
        })
        .matches(/^(?=.*[A-Z])/g, {
            message: 'Password must contain at least one upper case letter',
        })
        .min(8)
        .max(32),
})

export type CredentialsType = yup.InferType<typeof credentials>
