import { registerEnumType } from "type-graphql"

export enum PostSort {
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  id = "id",
  title = "title",
}
registerEnumType(PostSort, { name: "PostSort" })
