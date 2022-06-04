import {
    Cascade,
    Entity,
    ManyToOne,
    OneToOne
} from "@mikro-orm/core"
import { Field, ObjectType } from "type-graphql"
import { BaseEntity } from "./base-entity"
import { Post } from "./post"
import { UrlsSet } from "./urls-set"

@ObjectType()
@Entity()
export class Image extends BaseEntity {
  constructor(url: string) {
    super()
    this.url = new UrlsSet(url)
  }

  @Field()
  @OneToOne(() => UrlsSet, "image", { cascade: [Cascade.ALL] })
  url: UrlsSet

  @Field(() => Post)
  @ManyToOne(() => Post)
  post: Post
}
