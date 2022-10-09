export type PageInfoT = {
    hasNextPage: boolean
    cursor?: string
}

export type PaginatedResponse<T> = {
    list: T[]
    pageInfo: PageInfoT
}
