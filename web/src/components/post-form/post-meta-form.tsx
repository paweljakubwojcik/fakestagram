import type { FC, ComponentPropsWithoutRef, ForwardedRef } from "react"
import classnames from "classnames"
import { useAppSelector } from "lib/redux/hooks"
import { postFormSelectors } from "lib/redux/reducers/create-post"
import { useAuth } from "hooks/use-auth"

type PostMetaFormProps = ComponentPropsWithoutRef<"div">

export const PostMetaForm: FC<PostMetaFormProps> = ({ className }) => {
  const currentImage = useAppSelector(postFormSelectors.getCurrentImage)

  return (
      <div className={classnames("flex h-full w-full aspect-square justify-center items-center relative", className)}>
        <div
          className="block bg-contain bg-no-repeat bg-center w-full h-full"
          style={{
            backgroundImage: `url(${currentImage.croppedUrl})`,
          }}
        />
      </div>
  )
}

export const PostMetaFormPanel = () => {
  const { me } = useAuth()

  return (
    <div className="flex flex-col w-72 p-2 ">
      <div>{me?.username}</div>
      <textarea placeholder="Add description" rows={7} className="bg-transparent resize-none focus:outline-none" />
    </div>
  )
}
