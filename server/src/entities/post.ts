import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core"
import { Field, ObjectType } from "type-graphql"
import { BaseEntity } from "./base-entity"
import { Image } from "./image"
import { Like } from "./like"
import { User } from "./user"
@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field()
  @Property({ type: "text" })
  description: string = ""

  @Field()
  @ManyToOne()
  readonly creator: User

  @OneToMany(() => Like, "post")
  likes = new Collection<Like>(this)

  @Field(() => [Image])
  @OneToMany(() => Image, "post")
  readonly images: Collection<Image, this>

  @Field(() => String)
  @Property({ default: "16/9" })
  readonly aspectRatio: string = "16/9"

  constructor(images: string[]) {
    super()
    this.images = new Collection(
      this,
      images.map((url) => new Image({ post: this, originalUrl: url }))
    )
  }
}
