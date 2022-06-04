import { Entity, OneToOne, PrimaryKeyType, Property } from "@mikro-orm/core"
import { ObjectType, Field } from "type-graphql"
import { Image } from "./image"

@ObjectType()
@Entity()
export class UrlsSet {
  constructor(originUrl: string) {
    this.original = originUrl
    this.large = originUrl
    this.medium = originUrl
    this.small = originUrl
  }

  @OneToOne({ primary: true, entity: () => Image })
  image: Image

  @Field()
  @Property({ type: "text" })
  readonly small: string

  @Field()
  @Property({ type: "text" })
  readonly medium: string

  @Field()
  @Property({ type: "text" })
  readonly large: string

  @Field()
  @Property({ type: "text" })
  readonly original: string;

  [PrimaryKeyType]?: string
}
