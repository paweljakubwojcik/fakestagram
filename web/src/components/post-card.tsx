import { BasicPostFragmentFragment, LikesFragmentDoc, useLikeOrDislikePostMutation } from "@graphql"
import classnames from "classnames"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import type { ComponentPropsWithoutRef, FC } from "react"
import { Heart, MessageCircle, MoreHorizontal, Pocket, Send } from "react-feather"
import { Avatar } from "./avatar"
import { IconButton } from "./buttons"
import { Card } from "./card"

type PostCardProps = ComponentPropsWithoutRef<"div"> & {
  post: BasicPostFragmentFragment
}

export const PostCard: FC<PostCardProps> = ({ className, post }) => {
  const { description, images, aspectRatio, creator, createdAt, likedByMe, id, likeCount } = post

  const [likeOrDislike, { loading, error }] = useLikeOrDislikePostMutation({
    variables: {
      like: !likedByMe,
      post: id,
    },
    update: (cache, { data, errors }) => {
      cache.updateFragment(
        {
          id,
          fragment: LikesFragmentDoc,
        },
        (prev) => ({ ...prev, ...data?.likeOrDislikePost })
      )
    },
    optimisticResponse: ({ like, post }) => ({
      likeOrDislikePost: {
        id: post,
        likedByMe: like,
        likeCount: like ? likeCount + 1 : likeCount - 1,
        __typename: "Post",
      },
    }),
  })

  return (
    <Card className={classnames("flex-col flex text-base", className)}>
      <header className="flex items-center p-4">
        <Avatar size={30} user={creator} />
        <div className="ml-2 text-md"> {creator.username}</div>
        <IconButton className="ml-auto">
          <MoreHorizontal />
        </IconButton>
      </header>
      <div className="relative w-full" style={{ aspectRatio }}>
        <Image src={images[0].url.original} alt={"image"} layout={"fill"} objectFit={"cover"} />
      </div>
      <div className="px-4 py-2 space-y-2">
        <div className="flex py-3 child:mr-2">
          <IconButton
            active={likedByMe}
            onClick={async () => {
              try {
                likeOrDislike()
              } catch (e) {}
            }}
          >
            <Heart />
          </IconButton>
          <IconButton>
            <MessageCircle />
          </IconButton>
          <IconButton>
            <Send />
          </IconButton>
          <IconButton className="ml-auto !mr-0">
            <Pocket />
          </IconButton>
        </div>
        <div className="">
          <b>{creator.username} </b>
          {description}
        </div>
        <div className="text-sm font-light">{formatDistanceToNow(new Date(createdAt))} ago</div>
      </div>
    </Card>
  )
}
