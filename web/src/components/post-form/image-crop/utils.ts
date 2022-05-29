import { AspectRatio, EditableImage } from "../images-config-context"

export const bound = (value: number, max: number, min: number) => Math.min(Math.max(min, value), max)

export const softMaxFn = (value: number, min: number, max: number) => {
  const alpha = 0.2
  if (value < min) {
    return value * alpha + min * (1 - alpha)
  }
  if (value > max) {
    return value * alpha + max * (1 - alpha)
  }
  return value
}

export const getBoundary = (picRef: HTMLDivElement, viewportRef: HTMLDivElement) => {
  const picRect = picRef.getBoundingClientRect()!
  const viewportRect = viewportRef.getBoundingClientRect()!

  const minX = -(picRect.width - viewportRect.width) / 2
  const maxX = (picRect.width - viewportRect.width) / 2

  const minY = -(picRect.height - viewportRect.height) / 2
  const maxY = (picRect.height - viewportRect.height) / 2

  return { minX, maxX, minY, maxY }
}

type GetWidthAndHeightOptions = {
  originalAspectRatio: AspectRatio
  aspectRatio: AspectRatio
  height: number
  width: number
}
export const getWidthAndHeight = ({ aspectRatio, originalAspectRatio, width, height }: GetWidthAndHeightOptions) => {
  const widthToHeight = originalAspectRatio.x / originalAspectRatio.y
  const heightToWidth = originalAspectRatio.y / originalAspectRatio.x
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
}
