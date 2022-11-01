import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from "@mikro-orm/core"
import { Field, ObjectType } from "type-graphql"
import { BaseEntity } from "./base-entity"
import { LikeOnComment } from "./like-on-comment"
import { Post } from "./post"
import { User } from "./user"


@ObjectType()
@Entity()
export class Comment extends BaseEntity {
    @Field()
    @Property({ type: "text" })
    content: string = ""

    @Field()
    @ManyToOne()
    readonly author: User

    @ManyToMany(() => User, "likedComments", {
        pivotEntity: () => LikeOnComment,
        owner: true,
    })
    likes = new Collection<User>(this)

    @OneToMany(() => Comment, "replyTo")
    replies = new Collection<Comment, Comment>(this)

    @ManyToOne(() => Comment, { nullable: true })
    replyTo?: Comment

    @Field(() => Post, { nullable: true })
    @ManyToOne(() => Post, { nullable: true })
    readonly post?: Post
}
