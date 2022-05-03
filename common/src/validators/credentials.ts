import * as yup from 'yup'
import { YupSchema } from '../types/type-schema'

export interface ICredentials {
    username: string
    password: string
}

export const credentials = yup.object<YupSchema<ICredentials>>({
    username: yup.string().min(3).max(16).required().default('').label('Username'),

    password: yup
        .string()
        .default("")
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
        .max(32)
        .required()
        .label('Password'),
})

credentials.getDefault().password