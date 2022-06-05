import { QueryOrder } from "@mikro-orm/core"
import { QueryBuilder } from "@mikro-orm/postgresql"
import { BaseEntity } from "src/entities/base-entity"
import { RelayResponse } from "src/types/relay-pagination"
import { DefaultRelaySort } from "./default-relay-sort"
import { RelayPaginationArgs, SortDir } from "./relay-pagination-args"

export const getRelayResult = async <
  T extends BaseEntity,
  S extends string = DefaultRelaySort
>(
  query: QueryBuilder<T>,
  paginationOptions: RelayPaginationArgs<S>
): Promise<RelayResponse<T>> => {
  const {
    after,
    before,
    first,
    last,
    sort,
    order: sortOrder,
  } = paginationOptions

  const { cursor, relation } = (() => {
    if (after) {
      return { cursor: after, relation: "$gte" }
    }
    if (before) {
      return { cursor: before, relation: "$lte" }
    }
    return { cursor: "", relation: "" }
  })()

  if (cursor) {
    const cursorQuery = query
      .clone()
      .select([sort])
      .where({ id: cursor })
      .getKnexQuery()
    query.where({ [sort]: { [relation]: cursorQuery } })
  }

  const order = (() => {
    if (sortOrder === SortDir.ASC) {
      if (first) {
        return QueryOrder.ASC
      }
      if (last) {
        return QueryOrder.DESC
      }
    }
    if (sortOrder === SortDir.DESC) {
      if (first) {
        return QueryOrder.DESC
      }
      if (last) {
        return QueryOrder.ASC
      }
    }

    throw Error
  })()

  const limit = (first || last) as number
  const limitWithCursors = limit + 2

  query.limit(limitWithCursors).orderBy({
    [sort]: order,
  })

  const result = await query.getResult()

  const prev = result.at(0)?.id === cursor
  const next =
    (prev && result.length > limit + 1) || (!prev && result.length > limit)

  const edges = result
    .slice(prev ? 1 : 0)
    .slice(0, limit)
    .map((item) => ({
      node: item,
      cursor: item.id,
    }))

  if (last) {
    edges.reverse()
  }

  const startCursor = edges.at(0)?.cursor || null
  const endCursor = edges.at(-1)?.cursor || null

  return {
    edges,
    pageInfo: {
      startCursor,
      endCursor,
      hasNextPage: first ? next : prev,
      hasPreviousPage: first ? prev : next,
    },
  }
}
