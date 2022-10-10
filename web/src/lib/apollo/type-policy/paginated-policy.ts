import { FieldPolicy, Reference } from "@apollo/client"

type KeyArgs = FieldPolicy<any>["keyArgs"]

type BasicNode = Reference & { id?: string }

type PaginatedData<TNode> = {
    list: TNode[]
    pageInfo: {
        hasNextPage: boolean
        cursor?: string
    }
}

type GetCursorId<TNode extends BasicNode> = (data?: TNode) => string | undefined

const makeEmptyData = (): PaginatedData<any> => ({
    list: [],
    pageInfo: {
        hasNextPage: true,
        cursor: "",
    },
})

export function paginatedPolicy<TNode extends BasicNode = BasicNode>(
    keyArgs: KeyArgs = false,
    getCursorId: GetCursorId<TNode> = (t) => t?.id
): FieldPolicy<PaginatedData<TNode>> {
    return {
        keyArgs,

        read(existing, { canRead }) {
            if (!existing) return
            const list = existing.list.filter((node) => canRead(node))
            return {
                // Some implementations return additional Connection fields, such
                // as existing.totalCount. These fields are saved by the merge
                // function, so the read function should also preserve them.
                ...existing,
                list,
                pageInfo: {
                    ...existing.pageInfo,
                    cursor: getCursorId(list.at(-1)),
                },
            }
        },

        merge(existing = makeEmptyData(), incoming, { args }) {
            if (!args) return existing // TODO Maybe throw?

            const incomingEdges = incoming.list.slice(0) // copy array

            let prefix = existing.list
            if (args.cursor) {
                const index = prefix.findIndex((node) => getCursorId(node) === args.cursor)
                if (index >= 0) {
                    prefix = prefix.slice(0, index + 1)
                    // suffix = []; // already true
                }
            } else {
                // If we have neither args.after nor args.before, the incoming
                // edges cannot be spliced into the existing edges, so they must
                // replace the existing edges. See #6592 for a motivating example.
                prefix = []
            }

            const list = [...prefix, ...incomingEdges]

            return {
                ...existing,
                ...incoming,
                list,
                pageInfo: incoming.pageInfo,
            }
        },
    }
}
