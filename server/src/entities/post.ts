import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from "@mikro-orm/core"
import { Field, ObjectType } from "type-graphql"
import { BaseEntity } from "./base-entity"
import { Comment } from "./comment"
import { Image } from "./image"
import { Like } from "./like"
import { User } from "./user"
@ObjectType()
@Entity()
export class Post extends BaseEntity {
    @Field()
    @Property({ type: "text" })
    description: string = ""

    @Field(() => User)
    @ManyToOne(() => User)
    readonly author: User

    @ManyToMany(() => User, "liked", {
        pivotEntity: () => Like,
        owner: true,
    })
    likes = new Collection<User>(this)

    @ManyToMany(() => User, "saved")
    savedBy = new Collection<User>(this)

    @OneToMany(() => Comment, "post")
    readonly comments: Collection<Comment, this>

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
