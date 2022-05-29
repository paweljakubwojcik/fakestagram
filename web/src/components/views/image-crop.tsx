import classnames from "classnames"
import { Button, IconButton } from "components/buttons"
import { ButtonBase } from "components/buttons/button-base"
import { Slider } from "components/slider"
import {
  ComponentPropsWithoutRef,
  Dispatch,
  FC,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react"
import { flushSync } from "react-dom"
import { Copy as ImageSwitchIcon, Icon, Maximize as AspectRatioChangeIcon, ZoomIn as ScaleIcon } from "react-feather"
import useResizeObserver from "use-resize-observer"
import { ImageAction } from "./create-post"
import { CropData, EditableImage } from "./types/editable-image"

type ImageCropProps = ComponentPropsWithoutRef<"div"> & {
  images: Record<string, EditableImage>
  dispatch: Dispatch<ImageAction>
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

const getBoundary = (picRef: HTMLDivElement, viewportRef: HTMLDivElement) => {
  const picRect = picRef.getBoundingClientRect()!
  const viewportRect = viewportRef.getBoundingClientRect()!

  const minX = -(picRect.width - viewportRect.width) / 2
  const maxX = (picRect.width - viewportRect.width) / 2

  const minY = -(picRect.height - viewportRect.height) / 2
  const maxY = (picRect.height - viewportRect.height) / 2

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

export const ImageCrop: FC<ImageCropProps> = ({ className, images, dispatch }) => {
  const [imageKey, setImageKey] = useState(Object.keys(images)[0])

  const currentImage = images[imageKey]

  const [isGrabbing, setIsGrabbing] = useState(false)

  const picRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const mouseInitialPosition = useRef<Point>({ x: 0, y: 0 })

  const localTranslate = useRef<CropData>(currentImage.crop)
  const picPrevTranslate = useRef<CropData>(currentImage.crop)

  const applyTranslate = (newTranslateObj: Partial<CropData>) => {
    if (picRef.current) {
      const newTranslate = { ...currentImage.crop, ...newTranslateObj }
      const { x, y, scale } = newTranslate
      localTranslate.current = newTranslate
      picRef.current.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale})`
    }
  }
  useEffect(() => {
    // synchronizing with new pic
    applyTranslate({})
    picPrevTranslate.current = currentImage.crop
    localTranslate.current = currentImage.crop
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
    dispatch({ type: "SET_CROP", crop: newCropData, id: imageKey })
  }

  const { ref: containerRef, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>()

  const [openControl, setOpenControl] = useState<string>()

  const aspectRatio = currentImage.aspectRatio

  return (
    <div
      id="container"
      ref={containerRef}
      className={classnames("flex h-full w-full aspect-square justify-center items-center relative", className)}
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
            ...(() => {
              const widthToHeight = currentImage.originalAspectRatio.x / currentImage.originalAspectRatio.y
              const heightToWidth = currentImage.originalAspectRatio.y / currentImage.originalAspectRatio.x
              if (aspectRatio.y > aspectRatio.x) {
                return {
                  width: height * widthToHeight,
                  height,
                }
              }
              if (aspectRatio.y < aspectRatio.x) {
                return {
                  width,
                  height: width * heightToWidth,
                }
              }
              if (aspectRatio.y === aspectRatio.x) {
                if (widthToHeight > 1) {
                  return {
                    width: height * widthToHeight,
                    height,
                  }
                }
                if (widthToHeight <= 1) {
                  return {
                    width,
                    height: width * heightToWidth,
                  }
                }
              }
            })(),
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
      <div id="controls" className="absolute bottom-0 w-full p-4 flex">
        <EditMenu
          Icon={AspectRatioChangeIcon}
          setOpenControl={setOpenControl}
          openControl={openControl}
          name="AspectRatio"
        >
          <div className="">
            {ASPECTS_RATIOS.map(({ x, y }) => (
              <Button
                key={`${x}:${y}`}
                className={classnames(
                  "bg-transparent !text-white p-4 w-24 text-right group-hover:!bg-gray-50/20 opacity-60",
                  aspectRatio.x === x && aspectRatio.y === y && "!opacity-100"
                )}
                onClick={() => dispatch({ type: "SET_ASPECT_RATIO", aspectRatio: { x, y }, id: imageKey })}
              >
                {x}:{y}
              </Button>
            ))}
          </div>
        </EditMenu>
        <EditMenu
          Icon={ScaleIcon}
          className="mx-2"
          setOpenControl={setOpenControl}
          openControl={openControl}
          name="Scale"
        >
          <div>
            <Slider
              value={currentImage.crop.scale}
              onChange={(scale) => {
                applyTranslate({ scale })
                dispatch({ type: "SET_CROP", crop: { scale }, id: imageKey })
              }}
              min={1}
              max={2}
            />
          </div>
        </EditMenu>
        <EditMenu
          Icon={ImageSwitchIcon}
          className="ml-auto"
          setOpenControl={setOpenControl}
          openControl={openControl}
          name="ImageSwitch"
          menuClassName="right-0"
        >
          <div className="flex p-2 space-x-2">
            {Object.entries(images).map(([id, image]) => (
              <div key={id} className="relative">
                <IconButton
                  className="absolute right-2 top-2"
                  onClick={() => {
                    if (imageKey === id) {
                      const keys = Object.keys(images)
                      const currentImageIndex = keys.findIndex((i) => i === id)
                      setImageKey(keys[currentImageIndex > 0 ? currentImageIndex - 1 : keys.length + 1])
                    }
                    dispatch({ type: "REMOVE", id })
                  }}
                >
                  X
                </IconButton>
                <ButtonBase onClick={() => setImageKey(id)}>
                  <div
                    className="block w-24 h-24 bg-cover bg-no-repeat bg-center"
                    style={{
                      backgroundImage: `url(${image.base64url})`,
                    }}
                  ></div>
                </ButtonBase>
              </div>
            ))}
          </div>
        </EditMenu>
      </div>
    </div>
  )
}

type EditMenuProps = {
  Icon: Icon
  className?: string
  children: ReactNode
  setOpenControl: Dispatch<SetStateAction<string | undefined>>
  openControl: string | undefined
  name: string
  menuClassName?: string
}

const EditMenu = ({ className, Icon, children, openControl, name, setOpenControl, menuClassName }: EditMenuProps) => {
  const isOpen = openControl === name
  const containerRef = useRef<HTMLDivElement>(null)

  const onClickOutside = (e: globalThis.MouseEvent) => {
    if (!containerRef.current?.contains(e.target as Element)) {
      setOpenControl(undefined)
    }
  }
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", onClickOutside)
    }
    return () => {
      document.removeEventListener("click", onClickOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <div className={classnames(className, "relative")} ref={containerRef}>
      <div
        className={classnames(
          "bg-gray-900/80 rounded-md  my-2 text-white shadow-md",
          "absolute bottom-full transform transition-all",
          !isOpen && "opacity-0 translate-y-1 pointer-events-none",
          isOpen && "opacity-100 translate-y-0",
          menuClassName
        )}
      >
        {children}
      </div>
      <IconButton
        className={classnames("rounded-full p-2 bg-gray-900/80 hover:bg-gray-900/10", isOpen && "!bg-gray-900/10")}
        onClick={() => setOpenControl((v) => (v !== name ? name : undefined))}
        active={isOpen}
      >
        <Icon size={15} color={"white"} />
      </IconButton>
    </div>
  )
}
