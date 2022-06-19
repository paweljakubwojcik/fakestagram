import { ArgsType, Field, ID, Int, registerEnumType } from "type-graphql"
import { DefaultRelaySort } from "./default-relay-sort"


export enum SortDir {
  ASC = "ASC",
  DESC = "DESC"
}

registerEnumType(SortDir, {
  name: "SortDir",
  description: "Order of sorting",
})

@ArgsType()
export class RelayPaginationArgs<Sort extends string = DefaultRelaySort> {
  @Field(() => Int, { nullable: true })
  first?: number

  @Field(() => ID, { nullable: true })
  after?: string

  @Field(() => Int, { nullable: true })
  last?: number

  @Field(() => ID, { nullable: true })
  before?: string

  sort: Sort

  @Field(() => SortDir, { nullable: true })
  order: SortDir = SortDir.ASC
}
