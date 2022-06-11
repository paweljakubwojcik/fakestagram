import classnames from "classnames"
import { useAppDispatch, useAppSelector } from "lib/redux/hooks"
import { CropData, postFormActions, postFormSelectors } from "lib/redux/reducers/create-post"
import { ComponentPropsWithoutRef, FC, ForwardedRef, MouseEvent, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { Point } from "types"
import useResizeObserver from "use-resize-observer"
import { mergeRefs } from "utils/merge-refs"
import { Controls } from "./controls"
import { bound, getBoundary, getWidthAndHeight, softMaxFn } from "./utils"

type ImageCropProps = ComponentPropsWithoutRef<"div"> & {
  innerRef?: ForwardedRef<HTMLDivElement>
}

export const ImageCrop: FC<ImageCropProps> = ({ className, innerRef }) => {
  const dispatch = useAppDispatch()
  const { setCrop } = postFormActions

  const currentImage = useAppSelector(postFormSelectors.getCurrentImage)
  const imageKey = useAppSelector((state) => state.postForm.currentImage)
  const aspectRatio = useAppSelector((state) => state.postForm.aspectRatio)


  const [isGrabbing, setIsGrabbing] = useState(false)

  const picRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const mouseInitialPosition = useRef<Point>({ x: 0, y: 0 })

  const localTranslate = useRef<CropData>(currentImage.crop)
  const picPrevTranslate = useRef<CropData>(currentImage.crop)
  const { ref: containerRef, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>()

  const imageSizeOnScreen = getWidthAndHeight({
    aspectRatio,
    originalAspectRatio: currentImage.originalAspectRatio,
    width,
    height,
  })

  const applyTranslate = (newTranslateObj: Partial<CropData>) => {
    if (picRef.current) {
      const screenSizeCropData = {
        x: (currentImage.crop.x * imageSizeOnScreen.width) / currentImage.originalAspectRatio.x,
        y: (currentImage.crop.y * imageSizeOnScreen.height) / currentImage.originalAspectRatio.y,
        scale: currentImage.crop.scale,
      }
      const newTranslate = { ...screenSizeCropData, ...newTranslateObj }
      const { x, y, scale } = newTranslate
      localTranslate.current = newTranslate
      picRef.current.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale})`
    }
  }
  useEffect(() => {
    // synchronizing with new pic
    const screenSizeCropData = {
      x: (currentImage.crop.x * imageSizeOnScreen.width) / currentImage.originalAspectRatio.x,
      y: (currentImage.crop.y * imageSizeOnScreen.height) / currentImage.originalAspectRatio.y,
      scale: currentImage.crop.scale,
    }
    picPrevTranslate.current = screenSizeCropData
    localTranslate.current = screenSizeCropData
    applyTranslate({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageKey])

  const beginMove = (e: MouseEvent) => {
    setIsGrabbing(true)
    mouseInitialPosition.current = {
      x: e.clientX,
      y: e.clientY,
    }
  }

  const handleMove = (e: MouseEvent) => {
    if (isGrabbing && picRef.current && viewportRef.current) {
      const boundary = getBoundary(picRef.current, viewportRef.current)

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
      applyTranslate({ x, y })
    }
  }

  const endMove = (_e: MouseEvent) => {
    if (!isGrabbing) {
      return
    }
    // flushing before applyTranslate to enable transition
    flushSync(() => {
      setIsGrabbing(false)
    })
    const boundary = getBoundary(picRef.current!, viewportRef.current!)
    const newCropData = {
      x: bound(localTranslate.current.x, boundary.maxX, boundary.minX),
      y: bound(localTranslate.current.y, boundary.maxY, boundary.minY),
    }
    applyTranslate(newCropData)
    picPrevTranslate.current = localTranslate.current
    const realSizeCropData = {
      x: (newCropData.x * currentImage.originalAspectRatio.x) / imageSizeOnScreen.width,
      y: (newCropData.y * currentImage.originalAspectRatio.y) / imageSizeOnScreen.height,
    }
    dispatch(setCrop({ crop: realSizeCropData }))
  }

  return (
    <div
      id="container"
      ref={mergeRefs(containerRef, innerRef)}
      className={classnames("flex h-full aspect-square justify-center items-center relative", className)}
    >
      <div
        ref={viewportRef}
        id="viewport"
        className={classnames(
          "overflow-hidden relative flex justify-center items-center",
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
            backgroundImage: `url(${currentImage.base64url})`,
            ...imageSizeOnScreen,
          }}
          className={classnames(
            "block bg-cover bg-no-repeat bg-center cursor-grab origin-center flex-shrink-0",
            isGrabbing && "cursor-grabbing",
            !isGrabbing && "transition-transform"
          )}
          onMouseDown={beginMove}
          onMouseUp={endMove}
          onMouseLeave={endMove}
          onMouseMove={handleMove}
        />
        <div
          className={classnames(
            "absolute w-full h-full block pointer-events-none child:opacity-30 border child:shadow-camera transition-opacity top-0 left-0",
            isGrabbing && "opacity-1",
            !isGrabbing && "opacity-0"
          )}
        >
          <span className="w-full h-[1px] block bg-gray-50 absolute top-1/3" />
          <span className="w-full h-[1px] block bg-gray-50 absolute top-2/3" />
          <span className="h-full w-[1px] block bg-gray-50 absolute left-1/3" />
          <span className="h-full w-[1px] block bg-gray-50 absolute left-2/3" />
        </div>
      </div>
      <Controls applyTranslate={applyTranslate} />
    </div>
  )
}
