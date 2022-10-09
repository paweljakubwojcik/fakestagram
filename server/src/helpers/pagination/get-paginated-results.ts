import { QueryBuilder } from "@mikro-orm/postgresql"
import { BaseEntity } from "src/entities/base-entity"
import { PaginatedResponse } from "src/types/paginated-response"
import { PaginationArgs, SortDir } from "./pagination-args"

export const getPaginatedResults = async <T extends BaseEntity>(
    query: QueryBuilder<T>,
    { limit, order, cursor, sort = "createdAt" }: PaginationArgs
): Promise<PaginatedResponse<T>> => {
    const relation = order === SortDir.ASC ? "$gte" : "$lte"
    const limitWithCursors = limit + 1

    if (cursor) {
        const cursorQuery = query
            .clone() // it is safe to clone this caus cursor must be on the same list
            .select([sort])
            .where({ id: cursor })
            .getKnexQuery()
        query.where({ [sort]: { [relation]: cursorQuery } })
    }

    query.limit(limitWithCursors).orderBy({
        [sort]: order,
    })

    const result = await query.getResult()

    const posts = result.slice(0, limit)

    return {
        list: posts,
        pageInfo: {
            cursor: posts.at(-1)?.id,
            hasNextPage: result.length >= limitWithCursors,
        },
    }
}
