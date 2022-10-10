import { InMemoryCache } from "@apollo/client"
import { paginatedPolicy } from "./type-policy/paginated-policy"

export const inMemoryCache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                posts: paginatedPolicy(["sort", "order"]),
            },
        },
        User: {
            fields: {
                posts: paginatedPolicy(["sort", "order"]),
            },
        },
    },
})
