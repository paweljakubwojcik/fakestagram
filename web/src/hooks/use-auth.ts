import { MeDocument, useLogoutMutation, useMeQuery } from "@graphql"

export const useAuth = () => {
    const { data: { me } = {}, loading } = useMeQuery({ errorPolicy: "all" })
    const [logout] = useLogoutMutation({
        update: (cache) => {
            cache.writeQuery({
                query: MeDocument,
                data: {
                    me: null,
                },
            })
        },
    })

    return { me, logout, loading }
}
