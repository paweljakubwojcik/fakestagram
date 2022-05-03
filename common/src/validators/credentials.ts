import * as yup from 'yup'
import { YupSchema } from '../types/typ-schema'

export interface ICredentials {
    username: string
    password: string
}

export const credentials = yup.object<YupSchema<ICredentials>>({
    username: yup
        .string()
        .min(8, 'Password should have minimum ${min} length')
        .max(32, 'Password should have maximum ${max} characters')
        .required(),

    password: yup
        .string()
        .matches(/^(?=.*\d)/g, {
            message: 'Password must contain at least one number character',
        })
        .matches(/^(?=.*[a-z])/g, {
            message: 'Password must contain at least one lower case letter',
        })
        .matches(/^(?=.*[A-Z])/g, {
            message: 'Password must contain at least one upper case letter',
        })
        .min(8, 'Password should have minimum ${min} length')
        .max(32, 'Password should have maximum ${max} characters')
        .required(),
})
