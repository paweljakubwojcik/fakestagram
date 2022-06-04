import { Entity, ManyToOne, Property } from "@mikro-orm/core"
import { Field, ObjectType, Root } from "type-graphql"
import { BaseEntity } from "./base-entity"
import { Post } from "./post"

@ObjectType()
class UrlSet {
  @Field()
  original: string

  @Field()
  small: string
  @Field()
  medium: string
  @Field()
  large: string
}

@ObjectType()
@Entity()
export class Image extends BaseEntity {
  constructor(data: Partial<Image>) {
    super()
    Object.assign(this, data)
  }

  @Property({
    default:
      "https://instaclone.imgix.net/instaclone-posts/FSOTUDlaUAAnChz.jpg",
  })
  originalUrl: string

  @Field(() => Post)
  @ManyToOne(() => Post)
  post: Post

  @Field(() => UrlSet)
  url(@Root() image: Image): UrlSet {
    return {
      original: image.originalUrl,
      large: image.originalUrl,
      medium: image.originalUrl,
      small: image.originalUrl,
    }
  }
}
