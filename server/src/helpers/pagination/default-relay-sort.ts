import { registerEnumType } from "type-graphql"

export enum DefaultRelaySort {
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  id = "id",
}
registerEnumType(DefaultRelaySort, { name: `RelayDefaultSort` })

 