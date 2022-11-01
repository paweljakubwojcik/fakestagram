import { ApolloError, UserInputError } from "apollo-server-core"
import { Comment } from "src/entities/comment"
import { LikeOnComment } from "src/entities/like-on-comment"
import { Post } from "src/entities/post"
import { User } from "src/entities/user"
import { createPaginatedResult } from "src/helpers/pagination/get-paginated-result-type"
import { getPaginatedResults } from "src/helpers/pagination/get-paginated-results"
import { PaginationArgs } from "src/helpers/pagination/pagination-args"
import { isAuth } from "src/middleware/is-auth"
import { MyContext } from "src/types/context"
import { PaginatedResponse } from "src/types/paginated-response"
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
    registerEnumType,
    Resolver,
    Root,
    UseMiddleware,
} from "type-graphql"

@ArgsType()
class AddCommentInput {
    @Field()
    content: string

    @Field(() => ID, { nullable: true })
    post?: string

    @Field(() => ID, { nullable: true })
    comment?: string
}
@ArgsType()
class UpdateCommentData implements Partial<Comment> {
    @Field({ nullable: true })
    content?: string
}

enum CommentSort {
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    id = "id",
    likeCount = "likeCount",
}
registerEnumType(CommentSort, { name: "CommentSort" })

@ArgsType()
export class CommentArgsInput extends PaginationArgs {
    @Field(() => CommentSort, { nullable: true })
    sort: CommentSort = CommentSort.createdAt
}

@ArgsType()
export class CommentArgsInputWithPost extends CommentArgsInput {
    @Field()
    post: String
}

export const CommentConnection = createPaginatedResult(Comment)

@Resolver(() => Comment)
export class CommentResolver {
    @Query(() => CommentConnection)
    async comments(
        @Ctx() { em }: MyContext,
        @Args(() => CommentArgsInputWithPost) { order, cursor, limit, sort, post }: CommentArgsInputWithPost
    ): Promise<PaginatedResponse<Comment>> {
        return getPaginatedResults(em.qb(Comment).select(["*"]).where({ post }), {
            order,
            cursor,
            limit,
            sort,
        })
    }

    @Mutation(() => Comment)
    @UseMiddleware(isAuth)
    async createComment(
        @Args() { post, comment: replyTo, ...commentData }: AddCommentInput,
        @Ctx() { em, req }: MyContext
    ): Promise<Comment> {
        if (!post && !replyTo) {
            throw new ApolloError("You must specify parent of comment", "INVALID_ARGS")
        }

        const comment = em.create(Comment, {
            ...commentData,
            post: post ? em.getReference(Post, post) : null,
            replyTo: replyTo ? em.getReference(Comment, replyTo) : null,
            author: em.getReference(User, req.session.userId!),
        })
        await em.persistAndFlush(comment)
        return comment
    }

    @Mutation(() => Post, { nullable: true })
    @UseMiddleware(isAuth)
    async updateComment(
        @Arg("id") id: string,
        @Args() commentData: UpdateCommentData,
        @Ctx() { em }: MyContext
    ): Promise<Comment | null> {
        const comment = await em.findOne(Comment, { id })
        if (!comment) {
            throw new UserInputError("Post does not exist or have been deleted")
        }
        Object.assign(comment, commentData)
        await em.persistAndFlush(comment)
        return comment
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(@Arg("id") id: string, @Ctx() { em }: MyContext): Promise<boolean> {
        await em.nativeDelete(Post, { id })
        return true
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async likeOrDislikeComment(@Arg("comment") id: string, @Arg("like") like: boolean, @Ctx() { em, req }: MyContext) {
        try {
            if (like) {
                await em.persistAndFlush(
                    em.create(LikeOnComment, {
                        comment: em.getReference(Comment, id),
                        user: em.getReference(User, req.session.userId!),
                    })
                )
            } else {
                const like = await em.findOneOrFail(LikeOnComment, {
                    comment: em.getReference(Comment, id),
                    user: em.getReference(User, req.session.userId!),
                })
                em.removeAndFlush(like)
            }
        } catch (e) {
            if (e.name === "UniqueConstraintViolationException") {
                throw new ApolloError("Comment is already liked")
            }
            if (e.name === "ForeignKeyConstraintViolationException") {
                throw new UserInputError("Comment does not exist or have been deleted")
            }
            if (e.name === "NotFoundError") {
                throw new ApolloError("Comment doesn't exist or is not liked by you")
            }
            throw e
        } finally {
            return em.findOne(Comment, { id })
        }
    }

    @FieldResolver()
    async author(@Root() comment: Comment, @Ctx() { em }: MyContext) {
        return await em.findOne(User, { id: comment.author.id })
    }

    @FieldResolver(() => CommentConnection)
    async replies(
        @Root() comment: Comment,
        @Ctx() { em }: MyContext,
        @Args(() => CommentArgsInput) { limit, order, sort, cursor }: CommentArgsInput
    ) {
        return await getPaginatedResults(em.qb(Comment).select(["*"]).where({ replyTo: comment.id }), {
            order,
            cursor,
            limit,
            sort,
        })
    }

    @FieldResolver(() => [LikeOnComment])
    async likes(@Root() comment: Comment, @Ctx() { em }: MyContext) {
        await em.populate(comment, ["likes"])
        return comment.likes
    }

    @FieldResolver(() => Number)
    async likeCount(@Root() comment: Comment, @Ctx() { em }: MyContext) {
        return await em.count(LikeOnComment, { comment })
    }

    @FieldResolver(() => Boolean)
    async likedByMe(@Root() comment: Comment, @Ctx() { em, req }: MyContext) {
        return Boolean(
            await em.count(LikeOnComment, {
                comment,
                user: em.getReference(User, req.session.userId!),
            })
        )
    }
}
