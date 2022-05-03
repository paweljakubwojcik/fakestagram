export interface IEdge<T> {
  cursor: string
  node: T
}

export interface IPageInfo {
  startCursor: string | null
  endCursor: string | null
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface RelayResponse<T> {
  edges: IEdge<T>[]
  pageInfo: IPageInfo
}
