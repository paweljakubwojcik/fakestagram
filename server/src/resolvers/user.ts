import {
  credentials,
  type CredentialsType,
} from "@fakestagram/common/validators"
import { ApolloError, UserInputError } from "apollo-server-core"
import argon2 from "argon2"
import { COOKIE_NAME } from "src/constants"
import {
  PaginatedFieldResolver,
  RelayArgs,
} from "src/decorators/paginated-query"
import { ValidateArg } from "src/decorators/validate"
import { Post } from "src/entities/post"
import { User } from "src/entities/user"
import { PostSort } from "src/enums/post-sort"
import { getRelayResult, RelayPaginationArgs } from "src/helpers/pagination"
import { isAuth } from "src/middleware/is-auth"
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

@InputType()
class Credentials implements CredentialsType {
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
    @Arg("credentials")
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

  @Query(() => User, {
    description: "User public info",
  })
  async user(
    @Ctx() { req, em }: MyContext,
    @Arg("username") username: string
  ): Promise<User> {
    const user = await em.findOne(User, { username }, { populate: false })

    if (!user) {
      throw new ApolloError("No user with given username", "USER_NOT_FOUND")
    }

    const isMe = req.session.userId === user?.id

    await em.populate([user], ["followers", "following"])

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

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        if (err) {
          console.log(err)
          resolve(false)
          return
        } else {
          res.clearCookie(COOKIE_NAME)
          resolve(true)
        }
      })
    })
  }

  @UseMiddleware(isAuth)
  @Mutation(() => User)
  async follow(@Ctx() { req, em }: MyContext, @Arg("userId") id: string) {
    const userId = req.session.userId!
    if (id === userId) {
      return new ApolloError(
        "You cannot follow yourself",
        "CANNOT_FOLLOW_YOURSELF"
      )
    }

    const user = await em.findOne(
      User,
      { id: userId },
      { populate: ["following"] }
    )
    if (!user) {
      throw new Error()
    }

    const userToFollow = em.getReference(User, id)
    if (user.following.contains(userToFollow)) {
      return new ApolloError(
        "You already are following this user",
        "USER_ALREADY_FOLLOWED"
      )
    }
    user.following.add(userToFollow)
    await em.persistAndFlush(user)
    return user
  }

  @UseMiddleware(isAuth)
  @Mutation(() => User)
  async unFollow(@Ctx() { req, em }: MyContext, @Arg("userId") id: string) {
    const userId = req.session.userId!
    const user = await em.findOne(User, { id: userId }, {})
    if (!user) {
      throw new Error("This account does not exist or have been removed")
    }

    const userToUnFollow = em.getReference(User, id)
    await userToUnFollow.followers?.init()
    await user.following?.init()
    userToUnFollow.followers?.remove(user)
    user.following?.remove(userToUnFollow)
    await em.persistAndFlush([user, userToUnFollow])
    return user
  }

  @PaginatedFieldResolver(Post)
  async posts(
    @Root() user: User,
    @Ctx() { em }: MyContext,
    @RelayArgs(PostSort) paginationArgs: RelayPaginationArgs<PostSort>
  ) {
    const Query = em
      .qb(Post)
      .select(["*"])
      .where({ author: em.getReference(User, user.id) })
    return getRelayResult(Query, paginationArgs)
  }

  // TODO: paginate this
  @FieldResolver(() => [User])
  async followers(@Root() user: User, @Ctx() { em }: MyContext) {
    await em.populate(user, ["followers"], {})
    return user.followers
  }

  @FieldResolver(() => [User])
  async following(@Root() user: User, @Ctx() { em }: MyContext) {
    await em.populate(user, ["following"], {})
    return user.following
  }
}
