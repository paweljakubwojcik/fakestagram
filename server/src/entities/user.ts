import {
  Entity,
  OneToMany,
  Property,
  Collection,
} from "@mikro-orm/core"
import { Field, ObjectType } from "type-graphql"
import { BaseEntity } from "./base-entity"
import { Like } from "./like"
import { Post } from "./post"

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @Property({ type: "text", unique: true })
  username: string

  @Property({ type: "text" })
  password: string

  @Field(() => [Post])
  @OneToMany(() => Post, "creator")
  readonly posts = new Collection<Post, User>(this)

  @OneToMany(() => Like, "user")
  readonly likes = new Collection<Like>(this)
}
