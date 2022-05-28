import classnames from "classnames"
import { Button, IconButton } from "components/buttons"
import { PopoverMenu } from "components/popover-menu"
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
import { Popover } from "react-tiny-popover"
import useResizeObserver from "use-resize-observer"
import { EditableImage } from "./types/editable-image"

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

type TranslateObj = {
  x: number
  y: number
  scale: number
}

export const ImageCrop: FC<ImageCropProps> = ({ className, images }) => {
  const firstImage = Object.values(images)[0]

  const [isGrabbing, setIsGrabbing] = useState(false)

  const picRef = useRef<HTMLDivElement>(null)
  const mouseInitialPosition = useRef<Point>({ x: 0, y: 0 })

  const [aspectRatio, setAspectRatio] = useState<Point>(ASPECTS_RATIOS[2])

  const picTranslate = useRef<TranslateObj>({
    x: 0,
    y: 0,
    scale: 1,
  })
  const picPrevTranslate = useRef<TranslateObj>(picTranslate.current)

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
    setIsGrabbing(true)
    mouseInitialPosition.current = {
      x: e.clientX,
      y: e.clientY,
    }
  }

  const handleMove = (e: MouseEvent) => {
    if (isGrabbing && picRef.current && viewPortRef.current) {
      const boundary = getBoundary(picRef.current, viewPortRef.current)

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
    if (!isGrabbing) {
      return
    }
    flushSync(() => {
      setIsGrabbing(false)
    })
    const boundary = getBoundary(picRef.current!, viewPortRef.current!)
    setTranslation({
      x: bound(picTranslate.current.x, boundary.maxX, boundary.minX),
      y: bound(picTranslate.current.y, boundary.maxY, boundary.minY),
    })
    picPrevTranslate.current = picTranslate.current
  }

  const { ref: containerRef, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>()

  const { heightToWidth, widthToHeight } = getImageAspectRatio(firstImage.base64url)

  const [openControl, setOpenControl] = useState<string>()

  return (
    <div
      id="container"
      ref={containerRef}
      className={classnames("flex h-full w-full aspect-square justify-center items-center relative", className)}
    >
      <div
        ref={viewPortRef}
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
            backgroundImage: `url(${firstImage.base64url})`,
            ...(() => {
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
                onClick={() => setAspectRatio({ x, y })}
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
              initialValue={picTranslate.current.scale}
              onChange={(scale) => applyTranslate({ scale })}
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
          <div>Hello</div>
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
          !isOpen && "opacity-0 translate-y-1",
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
