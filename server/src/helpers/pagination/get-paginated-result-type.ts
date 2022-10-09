import { ClassType } from "src/types/class-type"
import { PageInfoT, PaginatedResponse } from "src/types/paginated-response"
import { Field, ID, ObjectType } from "type-graphql"

const typeMap = new Map<string, ClassType<PaginatedResponse<any>>>([]) // so one type is created only once
export function createPaginatedResult<T>(
    TItemClass: ClassType<T>
): ClassType<PaginatedResponse<T>> {
    const { name } = TItemClass
    const connectionName = `${name}Connection`

    if (typeMap.has(connectionName)) {
        return typeMap.get(connectionName)!
    }

    @ObjectType(`${name}PageInfo`, { isAbstract: true })
    class PageInfo implements PageInfoT {
        @Field(() => ID, { nullable: true })
        public cursor?: string

        @Field(() => Boolean)
        public hasNextPage: boolean
    }

    @ObjectType(connectionName, { isAbstract: true })
    class Connection implements PaginatedResponse<T> {
        public name = connectionName

        @Field(() => [TItemClass])
        public list!: T[]

        @Field(() => PageInfo)
        public pageInfo!: PageInfo
    }

    typeMap.set(connectionName, Connection)
    return Connection
}
