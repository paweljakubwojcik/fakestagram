import { withApollo } from "lib/apollo"
import type { NextPage } from "next"
import Head from "next/head"
import { Navbar } from "components/navbar"
import { authPage } from "components/auth-page"
import { SortDir, usePostsQuery } from "@graphql"
import { PostCard } from "components/post-card"
import { Button } from "components/buttons"
import { List } from "components/list"

const PAGE_SIZE = 4

const Home: NextPage = () => {
    const {
        data: { posts: { list: posts = [], pageInfo: { cursor = null, hasNextPage = false } = {} } = {} } = {},
        fetchMore,
        loading,
    } = usePostsQuery({
        variables: { limit: PAGE_SIZE, order: SortDir.Desc },
        notifyOnNetworkStatusChange: true,
    })

    return (
        <>
            <Head>
                <title>Home | Fakestagram</title>
            </Head>
            <Navbar />
            <main className="max-w-main-content mx-auto">
                <List
                    onScrollToEnd={() =>
                        fetchMore({
                            variables: {
                                cursor,
                            },
                        })
                    }
                    loading={loading}
                    enabled={hasNextPage}
                    className="-mx-3"
                >
                    {posts.map((post) => (
                        <PostCard post={post} key={post?.id} />
                    ))}
                </List>
            </main>
        </>
    )
}

export default withApollo(authPage(Home))
