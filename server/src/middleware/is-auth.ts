import { MyContext } from "src/types/context"
import { MiddlewareFn, UnauthorizedError } from "type-graphql"

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new UnauthorizedError()
  }
  return next()
}
