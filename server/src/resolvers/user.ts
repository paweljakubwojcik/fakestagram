import { User } from "src/entities/user"
import { MyContext } from "src/types/context"
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql"
import argon2 from "argon2"
import { ApolloError, UserInputError } from "apollo-server-core"
import { isAuth } from "src/middleware/is-auth"
import { Post } from "src/entities/post"
import { ValidateArg } from "src/decorators/validate"
import { type ICredentials, credentials } from "@fakestagram/common/validators"

@InputType()
class Credentials implements ICredentials {
  @Field()
  username: string

  @Field()
  password: string
}

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() { req, em }: MyContext) {
    const user = await em.findOne(User, { id: req.session.userId })
    return user
  }

  @Mutation(() => User)
  @ValidateArg("credentials", credentials)
  async register(
    @Arg("credentials") { password, username }: Credentials,
    @Ctx() { em, req }: MyContext
  ): Promise<User> {
    const hashedPassword = await argon2.hash(password)
    try {
      const user = em.create(User, { password: hashedPassword, username })
      await em.persistAndFlush(user)
      req.session.userId = user.id

      return user
    } catch (e) {
      if (e.name === "UniqueConstraintViolationException") {
        throw new UserInputError("Username is already taken")
      }
      throw e
    }
  }

  @Mutation(() => User)
  async login(
    @Arg("credentials", { validate: false })
    { password, username }: Credentials,
    @Ctx() { em, req }: MyContext
  ): Promise<User> {
    const user = await em.findOne(User, { username })
    if (!user) {
      throw new ApolloError("Incorrect credentials", "INVALID_CREDENTIALS")
    }
    const isValid = await argon2.verify(user.password, password)
    if (!isValid) {
      throw new ApolloError("Incorrect credentials", "INVALID_CREDENTIALS")
    }

    req.session.userId = user.id

    return user
  }

  @Query(() => Boolean)
  async isUsernameAvailable(
    @Arg("username") username: string,
    @Ctx() { em }: MyContext
  ): Promise<Boolean> {
    const usernameCount = await em.count(User, { username })
    return usernameCount === 0
  }

  @FieldResolver()
  async posts(@Root() user: User, @Ctx() { em }: MyContext) {
    return await em.find(Post, { creator: em.getReference(User, user.id) })
  }
}
