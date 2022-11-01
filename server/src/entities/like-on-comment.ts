import { Entity, ManyToOne } from "@mikro-orm/core"
import { Field, ObjectType } from "type-graphql"
import { BaseEntityWithoutId } from "./base-entity"
import { Comment } from "./comment"
import { User } from "./user"

@ObjectType()
@Entity()
export class LikeOnComment extends BaseEntityWithoutId {
    @Field(() => User)
    @ManyToOne({ primary: true })
    user: User

    @ManyToOne(() => Comment, { primary: true })
    comment: Comment
}