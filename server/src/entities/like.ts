import { Entity, ManyToOne } from "@mikro-orm/core"
import { Field, ObjectType } from "type-graphql"
import { BaseEntityWithoutId } from "./base-entity"
import { Post } from "./post"
import { User } from "./user"

@ObjectType()
@Entity()
export class Like extends BaseEntityWithoutId {
  @Field(() => User)
  @ManyToOne({ primary: true })
  user: User

  @ManyToOne({ primary: true })
  post: Post
}
