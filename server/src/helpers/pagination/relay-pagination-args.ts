import { ArgsType, Field, ID } from "type-graphql"
import { DefaultRelaySort } from "./default-relay-sort"

@ArgsType()
export class RelayPaginationArgs<Sort extends string = DefaultRelaySort> {
  @Field(() => Number, { nullable: true })
  first?: number

  @Field(() => ID, { nullable: true })
  after?: string

  @Field(() => Number, { nullable: true })
  last?: number

  @Field(() => ID, { nullable: true })
  before?: string

  sort: Sort
}
