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
  title: string = ""

  @Field()
  @Property({ type: "text" })
  body: string = ""

  @Field()
  @ManyToOne()
  creator: User

  @OneToMany(() => Like, "post")
  likes = new Collection<Like>(this)

  @Field(() => [Image])
  @OneToMany(() => Image, "post")
  images: Collection<Image, this>

  constructor(images: string[]) {
    super()
    this.images = new Collection(
      this,
      images.map((url) => new Image(url))
    )
  }
}
