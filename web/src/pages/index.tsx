import { withApollo } from "lib/apollo"
import type { NextPage } from "next"
import Head from "next/head"
import { Navbar } from "components/navbar"
import { authPage } from "components/auth-page"
import { usePostsQuery } from "@graphql"
import { PostCard } from "components/post-card"

const Home: NextPage = () => {
  const { data: { posts: { edges = [] } = {} } = {} } = usePostsQuery({ variables: { first: 10 } })

  return (
    <>
      <Head>
        <title>Home | Fakestagram</title>
      </Head>
      <Navbar />
      <main className="max-w-main-content mx-auto">
        <div>
          {edges.map(({ node: post }) => (
            <PostCard post={post} key={post?.id} />
          ))}
        </div>
      </main>
    </>
  )
}

export default withApollo(authPage(Home))
