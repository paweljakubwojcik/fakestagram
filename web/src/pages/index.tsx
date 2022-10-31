import { SortDir, usePostsQuery } from "@graphql"
import { authPage } from "components/auth-page"
import { Card } from "components/card"
import { List } from "components/list"
import { Navbar } from "components/navbar"
import { PostCard } from "components/post-card"
import type { NextPage } from "next"
import Head from "next/head"

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
            <main className="max-w-main-content mx-auto flex items-start">
                <div className="max-w-2xl flex-grow-[3]">
                    <List
                        onScrollToEnd={() => {
                            fetchMore({
                                variables: {
                                    cursor,
                                },
                            })
                        }}
                        loading={loading}
                        enabled={hasNextPage}
                        className="-mx-3"
                    >
                        {posts.map((post) => (
                            <PostCard post={post} key={post?.id} />
                        ))}
                    </List>
                </div>
                <Card className="flex-grow-[1] hidden sm:flex h-40 !mr-0 sticky top-[60px]">idk</Card>
            </main>
        </>
    )
}

export default authPage(Home)
