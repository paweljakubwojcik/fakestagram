import { BasicPostFragmentFragment, LikesFragmentDoc, useLikeOrDislikePostMutation } from "@graphql"
import classnames from "classnames"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { ComponentPropsWithoutRef, FC, useState } from "react"
import { ArrowLeftCircle, ArrowRightCircle, Heart, MessageCircle, MoreHorizontal, Pocket, Send } from "react-feather"
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

  const [activeIndex, setActiveIndex] = useState(0)
  const hasCarousel = images.length > 1

  return (
    <Card className={classnames("flex-col flex text-base", className)}>
      <header className="flex items-center p-4">
        <Avatar size={30} user={creator} />
        <div className="ml-2 text-md"> {creator.username}</div>
        <IconButton className="ml-auto">
          <MoreHorizontal />
        </IconButton>
      </header>
      <div
        className="relative w-full flex flex-col justify-center overflow-hidden border-y dark:border-gray-300/30"
        style={{ aspectRatio }}
      >
        {images.map(({ url, id }, i) => (
          <div
            key={id}
            className="transition-transform duration-500 absolute w-full h-full"
            style={{ transform: `translateX(${i - activeIndex}00%)` }}
          >
            <Image src={url.original} blurDataURL={url.small}  alt={"image"} layout={"fill"} objectFit={"cover"} placeholder={"blur"} />
          </div>
        ))}
        {hasCarousel && (
          <div className="absolute flex w-full justify-between p-4 opacity-60">
            <IconButton
              onClick={() => setActiveIndex((i) => i - 1)}
              className={classnames(activeIndex === 0 && "invisible")}
            >
              <ArrowLeftCircle size={40} />
            </IconButton>
            <IconButton
              onClick={() => setActiveIndex((i) => i + 1)}
              className={classnames(activeIndex === images.length - 1 && "invisible")}
            >
              <ArrowRightCircle size={40} />
            </IconButton>
          </div>
        )}
      </div>
      <div className="px-4 py-2 space-y-2 relative">
        {hasCarousel && (
          <div className="absolute flex top-4 w-full justify-center space-x-2">
            {images.map((_, i) => (
              <div
                role="button"
                key={i}
                className={classnames(
                  "block w-2 aspect-square rounded-full cursor-pointer",
                  i !== activeIndex && "bg-gray-300",
                  i === activeIndex && "bg-primary"
                )}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
        <div className="flex child:mr-2">
          <IconButton
            active={likedByMe}
            onClick={async () => {
              try {
                likeOrDislike({})
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
