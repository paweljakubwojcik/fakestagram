import { ApolloClientOptions } from "@apollo/client"

export const config: Omit<ApolloClientOptions<any>, "cache"> = {
  uri: "http://localhost:4000/graphql",
  credentials: "include",
  connectToDevTools: true,
}
