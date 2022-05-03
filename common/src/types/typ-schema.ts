import { AnySchema } from 'yup'

export type YupSchema<T> = Partial<Record<keyof T, AnySchema>>
