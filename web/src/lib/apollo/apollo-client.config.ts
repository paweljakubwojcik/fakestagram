import { ApolloClientOptions, HttpLink } from "@apollo/client"

export const config: Omit<ApolloClientOptions<any>, "cache"> = {
  link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
}
