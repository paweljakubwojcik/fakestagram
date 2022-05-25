import { FC, ComponentPropsWithoutRef, useState, useRef, MouseEvent, useMemo } from "react"
import classnames from "classnames"
import { EditableImage } from "../types/editable-image"
import useResizeObserver from "use-resize-observer"
import { flushSync } from "react-dom"

type ImageCropProps = ComponentPropsWithoutRef<"div"> & {
  images: Record<string, EditableImage>
}

const getImageAspectRatio = (url: string) => {
  const image = document.createElement("img")
  image.src = url

  return {
    heightToWidth: image.height / image.width,
    widthToHeight: image.width / image.height,
  }
}

const bound = (value: number, max: number, min: number) => Math.min(Math.max(min, value), max)

const softMaxFn = (value: number, min: number, max: number) => {
  const alpha = 0.2
  if (value < min) {
    return value * alpha + min * (1 - alpha)
  }
  if (value > max) {
    return value * alpha + max * (1 - alpha)
  }
  return value
}

const getBoundary = (picRef: HTMLDivElement, viewportRef: HTMLDivElement, scale: number) => {
  const picRect = picRef.getBoundingClientRect()!
  const viewportRect = viewportRef.getBoundingClientRect()!

  const minX = -picRect.width + viewportRect.width
  const maxX = 0

  const minY = -picRect.height + viewportRect.height
  const maxY = 0

  return { minX, maxX, minY, maxY }
}

type Point = { x: number; y: number }

const ASPECTS_RATIOS: Point[] = [
  {
    x: 1,
    y: 1,
  },
  {
    x: 4,
    y: 5,
  },
  {
    x: 16,
    y: 9,
  },
]

type TranslateObj = {
  x: number
  y: number
  scale: number
}



export const ImageCrop: FC<ImageCropProps> = ({ className, images }) => {
  const firstImage = Object.values(images)[0]

  const [grab, setGrab] = useState(false)

  const picRef = useRef<HTMLDivElement>(null)
  const mouseInitialPosition = useRef<Point>({ x: 0, y: 0 })
  const picCurrentTranslate = useRef<Point>({ x: 0, y: 0 })
  const picPrevTranslate = useRef<Point>(picCurrentTranslate.current)

  const [aspectRatio] = useState<Point>(ASPECTS_RATIOS[0])

  const picTranslate = useRef<TranslateObj>({
    x: 0,
    y: 0,
    scale: 1,
  })

  const applyTranslate = (newTranslateObj: Partial<TranslateObj>) => {
    if (picRef.current) {
      const newTranslate = { ...picTranslate.current, ...newTranslateObj }
      picTranslate.current = newTranslate
      const { x, y, scale } = newTranslate
      picRef.current.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale})`
    }
  }

  const setTranslation = ({ x, y }: Point) => {
    applyTranslate({ x, y })
  }

  const viewPortRef = useRef<HTMLDivElement>(null)

  const beginMove = (e: MouseEvent) => {
    setGrab(true)
    mouseInitialPosition.current = {
      x: e.clientX,
      y: e.clientY,
    }
  }

  const handleMove = (e: MouseEvent) => {
    if (grab && picRef.current && viewPortRef.current) {
      const boundary = getBoundary(picRef.current, viewPortRef.current, picTranslate.current.scale)

      const x = softMaxFn(
        picPrevTranslate.current.x + e.clientX - mouseInitialPosition.current.x,
        boundary.minX,
        boundary.maxX
      )
      const y = softMaxFn(
        picPrevTranslate.current.y + e.clientY - mouseInitialPosition.current.y,
        boundary.minY,
        boundary.maxY
      )
      setTranslation({ x, y })
    }
  }

  const endMove = (_e: MouseEvent) => {
    if (!grab) {
      return
    }
    flushSync(() => {
      setGrab(false)
    })
    const boundary = getBoundary(picRef.current!, viewPortRef.current!, picTranslate.current.scale)
    setTranslation({
      x: bound(picCurrentTranslate.current.x, boundary.maxX, boundary.minX),
      y: bound(picCurrentTranslate.current.y, boundary.maxY, boundary.minY),
    })
    picPrevTranslate.current = picCurrentTranslate.current
  }

  const { ref: containerRef, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>()

  const { heightToWidth, widthToHeight } = getImageAspectRatio(firstImage.base64url)

  return (
    <div
      id="container"
      ref={containerRef}
      className={classnames("flex h-full w-full justify-center items-center", className)}
    >
      <div
        ref={viewPortRef}
        id="viewport"
        className={classnames(
          "overflow-hidden relative",
          aspectRatio.y > aspectRatio.x && "h-full",
          aspectRatio.y <= aspectRatio.x && "w-full",
          className
        )}
        style={{
          aspectRatio: `${aspectRatio.x}/${aspectRatio.y}`,
        }}
      >
        <div
          id="image"
          ref={picRef}
          style={{
            backgroundImage: `url(${firstImage.base64url})`,
            ...(() => {
              if (aspectRatio.y > aspectRatio.x) {
                return {
                  width: height * widthToHeight,
                  height,
                }
              }
              if (aspectRatio.y <= aspectRatio.x) {
                return {
                  width,
                  height: width * heightToWidth,
                }
              }
            })(),
          }}
          className={classnames(
            "block bg-cover bg-no-repeat bg-center cursor-grab origin-center",
            grab && "cursor-grabbing",
            !grab && "transition-transform"
          )}
          onMouseDown={beginMove}
          onMouseUp={endMove}
          onMouseLeave={endMove}
          onMouseMove={handleMove}
        />
        <div
          className={classnames(
            "absolute w-full h-full block pointer-events-none child:opacity-30 border child:shadow-camera transition-opacity top-0 left-0",
            grab && "opacity-1",
            !grab && "opacity-0"
          )}
        >
          <span className="w-full h-[1px] block bg-gray-50 absolute top-1/3" />
          <span className="w-full h-[1px] block bg-gray-50 absolute top-2/3" />
          <span className="h-full w-[1px] block bg-gray-50 absolute left-1/3" />
          <span className="h-full w-[1px] block bg-gray-50 absolute left-2/3" />
        </div>
      </div>
    </div>
  )
}
