import { ApolloError, UserInputError } from "apollo-server-core"
import { PaginatedQuery, RelayArgs } from "src/decorators/paginated-query"
import { Image } from "src/entities/image"
import { Like } from "src/entities/like"
import { Post } from "src/entities/post"
import { User } from "src/entities/user"
import { PostSort } from "src/enums/post-sort"
import { getRelayResult, RelayPaginationArgs } from "src/helpers/pagination"
import { isAuth } from "src/middleware/is-auth"
import { MyContext } from "src/types/context"
import { RelayResponse } from "src/types/relay-pagination"
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql"

@ArgsType()
class AddPostInput {
  @Field()
  description: string

  @Field(() => [String])
  images: string[]

  @Field(() => String)
  aspectRatio: string
}
@ArgsType()
class UpdatePostInput implements Partial<Post> {
  @Field({ nullable: true })
  description?: string
}

@Resolver(() => Post)
export class PostResolver {
  @Query(() => Post, { nullable: true })
  post(
    @Arg("id", () => ID) id: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id })
  }

  @PaginatedQuery(Post)
  async posts(
    @Ctx() { em }: MyContext,
    @RelayArgs(PostSort) paginationArgs: RelayPaginationArgs<PostSort>
  ): Promise<RelayResponse<Post>> {
    const Query = em.qb(Post).select(["*"])
    return getRelayResult(Query, paginationArgs)
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Args() postData: AddPostInput,
    @Ctx() { em, req }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, {
      ...postData,
      author: em.getReference(User, req.session.userId!),
    })
    await em.persistAndFlush(post)
    return post
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("id") id: string,
    @Args() postData: UpdatePostInput,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id })
    if (!post) {
      throw new UserInputError("Post does not exist or have been deleted")
    }
    Object.assign(post, postData)
    await em.persistAndFlush(post)
    return post
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg("id") id: string,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    await em.nativeDelete(Post, { id })
    return true
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async likeOrDislikePost(
    @Arg("post") id: string,
    @Arg("like") like: boolean,
    @Ctx() { em, req }: MyContext
  ) {
    try {
      if (like) {
        await em.persistAndFlush(
          em.create(Like, {
            post: em.getReference(Post, id),
            user: em.getReference(User, req.session.userId!),
          })
        )
      } else {
        const like = await em.findOneOrFail(Like, {
          post: em.getReference(Post, id),
          user: em.getReference(User, req.session.userId!),
        })
        em.removeAndFlush(like)
      }
    } catch (e) {
      if (e.name === "UniqueConstraintViolationException") {
        throw new ApolloError("Post is already liked")
      }
      if (e.name === "ForeignKeyConstraintViolationException") {
        throw new UserInputError("Post does not exist or have been deleted")
      }
      if (e.name === "NotFoundError") {
        throw new ApolloError("Post doesn't exist or is not liked by you")
      }
      throw e
    } finally {
      return em.findOne(Post, { id })
    }
  }

  @FieldResolver()
  async author(@Root() post: Post, @Ctx() { em }: MyContext) {
    return await em.findOne(User, { id: post.author.id })
  }

  @FieldResolver()
  async images(@Root() post: Post, @Ctx() { em }: MyContext) {
    return await em.find(Image, { post: post.id })
  }

  @FieldResolver(() => [Like])
  async likes(@Root() post: Post, @Ctx() { em }: MyContext) {
    await em.populate(post, ["likes.user"])
    return post.likes
  }

  @FieldResolver(() => Number)
  async likeCount(@Root() post: Post, @Ctx() { em }: MyContext) {
    return await em.count(Like, { post })
  }

  @FieldResolver(() => Boolean)
  async likedByMe(@Root() post: Post, @Ctx() { em, req }: MyContext) {
    return Boolean(
      await em.count(Like, {
        post,
        user: em.getReference(User, req.session.userId!),
      })
    )
  }
}
