import { ValidationError } from "apollo-server-core"
import { DefaultRelaySort } from "src/helpers/pagination/default-relay-sort"
import { RelayPaginationArgs } from "src/helpers/pagination/relay-pagination-args"
import { ClassType } from "src/types/class-type"
import { MyContext } from "src/types/context"
import { IEdge, IPageInfo, RelayResponse } from "src/types/relay-pagination"
import {
  Args,
  ArgsType,
  createParamDecorator,
  Field,
  ID,
  ObjectType,
  Query,
} from "type-graphql"
import { AdvancedOptions } from "type-graphql/dist/decorators/types"

// const typeMap = {}
export function createConnection<T>(
  TItemClass: ClassType<T>
): ClassType<RelayResponse<T>> {
  const { name } = TItemClass

  @ObjectType({ isAbstract: true })
  class Edge implements IEdge<T> {
    public name = `${name}Edge`
    @Field({ nullable: true })
    public cursor!: string

    @Field(() => TItemClass)
    public node!: T
  }

  @ObjectType(`${name}PageInfo`, { isAbstract: true })
  class PageInfo implements IPageInfo {
    @Field(() => ID, { nullable: true })
    public startCursor: string | null

    @Field(() => ID, { nullable: true })
    public endCursor: string | null

    @Field(() => Boolean)
    public hasPreviousPage: boolean

    @Field(() => Boolean)
    public hasNextPage: boolean
  }

  @ObjectType(`${name}Connection`, { isAbstract: true })
  class Connection implements RelayResponse<T> {
    public name = `${name}Connection`

    @Field(() => [Edge])
    public edges!: IEdge<T>[]

    @Field(() => PageInfo)
    public pageInfo!: PageInfo
  }

  return Connection
}

export const RelayArgs = (
  Sort: object = DefaultRelaySort
): ParameterDecorator => {
  const RelayParametersGuard = createParamDecorator<MyContext>(({ args }) => {
    const { first, last, before, after } = args

    if (!!before && !!after)
      throw new ValidationError(
        "Ambiguous query: before and after should not be used together"
      )

    if (!!first && !!last)
      throw new ValidationError(
        "Ambiguous query: first and last should not be used together"
      )
    if (!first && !last)
      throw new ValidationError("Missing first or last argument")
  })

  @ArgsType()
  class Result extends RelayPaginationArgs {
    @Field(() => Sort, { nullable: true, defaultValue: "createdAt" })
    sort: keyof typeof Sort
  }

  return (...args) => {
    Args(() => Result)(...args)
    RelayParametersGuard(...args)
  }
}

export function PaginatedQuery<T>(
  TItemClass: ClassType<T>,
  options?: AdvancedOptions
): MethodDecorator {
  const RelayResponse = createConnection(TItemClass)
  return Query(() => RelayResponse, options)
}
