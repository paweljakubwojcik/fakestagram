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
    prefix = "https://instaclone.imgix.net/"

    constructor({ originalUrl, ...data }: Partial<Image>) {
        super()
        this.originalUrl = `${this.prefix}${originalUrl}`
        Object.assign(this, data)
    }

    @Property()
    @Field()
    originalUrl: string

    @Field(() => Post)
    @ManyToOne(() => Post)
    post?: Post

    @Field(() => UrlSet)
    url(@Root() image: Image): UrlSet {
        return {
            original: `${image.originalUrl}`,
            large: `${image.originalUrl}?w=1400`,
            medium: `${image.originalUrl}?w=900`,
            small: `${image.originalUrl}?w=100`,
        }
    }
}
