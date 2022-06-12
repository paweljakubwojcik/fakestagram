import { AspectRatio, EditableImage, Size } from "lib/redux/reducers/create-post"

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
  originalSize: Size
  aspectRatio: AspectRatio
  height: number
  width: number
}
/**
 * Compute dimensions that image should have, given the desired aspect ratio and container dimensions
 */
export const getWidthAndHeight = ({ aspectRatio, originalSize, width, height }: GetWidthAndHeightOptions) => {
  const widthToHeight = originalSize.width / originalSize.height
  const heightToWidth = originalSize.height / originalSize.width
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
  return {
    width: 0,
    height: 0,
  }
}

type CropImageOptions = EditableImage & { aspectRatio: AspectRatio }

export const cropImage = ({ originalUrl: src, aspectRatio, crop: { scale, x, y }, originalSize }: CropImageOptions) => {
  const { width: originalWidth, height: originalHeight } = originalSize
  const canvas = document.createElement("canvas")

  const ctx = canvas.getContext("2d")

  const image = new Image()
  image.src = src

  let width = originalWidth
  let height = originalHeight

  if (aspectRatio.x < aspectRatio.y) {
    width = (aspectRatio.x / aspectRatio.y) * height
  }
  if (aspectRatio.x > aspectRatio.y) {
    height = (aspectRatio.y / aspectRatio.x) * width
  }
  if (aspectRatio.x === aspectRatio.y) {
    if (width > height) {
      width = (aspectRatio.x / aspectRatio.y) * height
    }
    if (width <= height) {
      height = (aspectRatio.y / aspectRatio.x) * width
    }
  }

  const sx = -((width - originalWidth * scale) / 2 + x) / scale
  const sy = -((height - originalHeight * scale) / 2 + y) / scale

  canvas.width = width
  canvas.height = height

  return new Promise<string>((res) => {
    image.onload = function () {
      ctx?.drawImage(image, sx, sy, width / scale, height / scale, 0, 0, width, height)
      const url = canvas.toDataURL("image/jpeg", 1)
      res(url)
    }
  })
}
