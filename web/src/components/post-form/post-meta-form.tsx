import { FC, ComponentPropsWithoutRef, ForwardedRef, useState } from "react"
import classnames from "classnames"
import { useAuth } from "hooks/use-auth"
import { getCurrentImage, usePostState } from "./post-state"
import { ImageCarousel } from "components/image-carousel"

type PostMetaFormProps = ComponentPropsWithoutRef<"div">

export const PostMetaForm: FC<PostMetaFormProps> = ({ className }) => {
    const images = usePostState((state) => Object.entries(state.images))
    const aspectRatio = usePostState((state) => state.aspectRatio)
    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <div className={classnames("flex h-full w-full aspect-square justify-center items-center relative", className)}>
            <ImageCarousel
                images={images.map(([id, image]) => ({ id, url: image.croppedUrl! }))}
                activeIndex={activeIndex}
                onIndexChange={setActiveIndex}
                imageProps={{
                    className: classnames([
                        aspectRatio.y > aspectRatio.x && "h-full",
                        aspectRatio.y <= aspectRatio.x && "w-full",
                    ]),
                    style: { aspectRatio: `${aspectRatio.x}/${aspectRatio.y}` },
                }}
            />
        </div>
    )
}

export const PostMetaFormPanel = () => {
    const { me } = useAuth()
    console.log("render")
    const setDescription = usePostState((state) => state.setDescription)

    return (
        <div className="flex flex-col w-72 p-2 ">
            <div>{me?.username}</div>
            <textarea
                placeholder="Add description"
                rows={7}
                className="bg-transparent resize-none focus:outline-none"
                onChange={(e) => setDescription(e.target.value)}
            />
        </div>
    )
}
