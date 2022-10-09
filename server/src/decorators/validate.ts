import { ApolloError } from "apollo-server-core"
import { ArgsDictionary, createMethodDecorator } from "type-graphql"
import { AnySchema, ValidationError } from "yup"

const validate = async (schema: AnySchema, args: ArgsDictionary) => {
  try {
    await schema.validate(args, { abortEarly: false })
  } catch (e) {
    if (e instanceof ValidationError) {
      throw new ApolloError(e.message, "VALIDATION_ERROR", e)
    }
  }
}

/**
 * Decorator for validating args with yup schema 
 */
export function ValidateArgs(schema: AnySchema) {
  return createMethodDecorator(async ({ args }, next) => {
    await validate(schema, args)
    return next()
  })
}

/**
 * Decorator for validating args with yup schema 
 */
export function ValidateArg(argName: string, schema: AnySchema) {
  return createMethodDecorator(async ({ args }, next) => {
    await validate(schema, args[argName])
    return next()
  })
}
