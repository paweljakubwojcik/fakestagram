import {
  Entity,
  OneToMany,
  Property,
  Collection,
  ManyToMany,
  Cascade,
} from "@mikro-orm/core"
import { Field, ObjectType } from "type-graphql"
import { BaseEntity } from "./base-entity"
import { Post } from "./post"

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @Property({ type: "text", unique: true })
  username: string

  @Property({ type: "text" })
  password: string

  @OneToMany(() => Post, "author")
  readonly posts = new Collection<Post, User>(this)

  @ManyToMany(() => Post, "likes")
  liked = new Collection<Post>(this)

  /**
   * saved posts
   */
  @ManyToMany(() => Post, "savedBy", { owner: true })
  saved = new Collection<Post>(this, [])

  @ManyToMany(() => User, "following", {
    owner: true,
    cascade: [Cascade.REMOVE],
  })
  followers = new Collection<User>(this, [])

  @ManyToMany(() => User, "followers", { cascade: [Cascade.REMOVE] })
  following = new Collection<User>(this, [])
}
