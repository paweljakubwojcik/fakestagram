import classnames from "classnames"
import Image from "next/image"
import type { ComponentProps, ComponentPropsWithoutRef, FC } from "react"
import { ArrowLeftCircle, ArrowRightCircle } from "react-feather"
import { IconButton } from "./buttons"

type ImageCarouselProps = ComponentPropsWithoutRef<"div"> & {
    activeIndex: number
    onIndexChange: (index: number) => void
    images: { url: string; blurUrl?: string; id: string }[]
    imageProps?: Partial<ComponentPropsWithoutRef<"div">>
}

export const ImageCarousel: FC<ImageCarouselProps> = ({
    className,
    activeIndex,
    onIndexChange,
    images,
    imageProps,
    ...props
}) => {
    const hasCarousel = images.length > 1

    return (
        <div
            className={classnames(
                "relative w-full h-full flex flex-col justify-center items-center overflow-hidden border-y dark:border-gray-300/30",
                className
            )}
            {...props}
        >
            {images.map(({ url, id, blurUrl }, i) => (
                <div
                    key={id}
                    className="transition-transform duration-500 absolute w-full h-full flex justify-center items-center"
                    style={{ transform: `translateX(${i - activeIndex}00%)` }}
                >
                    <div {...imageProps} className={classnames("relative", imageProps?.className)}>
                        <Image
                            src={url}
                            blurDataURL={blurUrl || url}
                            alt={"image"}
                            layout={"fill"}
                            objectFit={"cover"}
                            placeholder={"blur"}
                        />
                    </div>
                </div>
            ))}
            {hasCarousel && (
                <div className="absolute flex w-full justify-between p-4 opacity-60">
                    <IconButton
                        onClick={() => onIndexChange(activeIndex - 1)}
                        className={classnames(activeIndex === 0 && "invisible")}
                    >
                        <ArrowLeftCircle size={40} />
                    </IconButton>
                    <IconButton
                        onClick={() => onIndexChange(activeIndex + 1)}
                        className={classnames(activeIndex === images.length - 1 && "invisible")}
                    >
                        <ArrowRightCircle size={40} />
                    </IconButton>
                </div>
            )}
        </div>
    )
}
