import { ArgsType, Field, ID, Int, registerEnumType } from "type-graphql"

export enum SortDir {
    ASC = "ASC",
    DESC = "DESC",
}

registerEnumType(SortDir, {
    name: "SortDir",
    description: "Order of sorting",
})

@ArgsType()
export class PaginationArgs {
    @Field(() => Int, { nullable: true })
    limit: number

    @Field(() => ID, { nullable: true })
    cursor?: string

    @Field(() => SortDir, { nullable: true })
    order: SortDir = SortDir.ASC

    @Field(() => String, { nullable: true })
    sort?: string = "createdAt"
}
