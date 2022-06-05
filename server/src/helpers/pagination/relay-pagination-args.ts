import { ArgsType, Field, ID, Int } from "type-graphql"
import { DefaultRelaySort } from "./default-relay-sort"

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
}
