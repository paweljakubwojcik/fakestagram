import produce from "immer"
import { createContext, Dispatch, useContext } from "react"
import { getImageAspectRatio } from "utils/get-image-aspect-ratio"
import { toBase64 } from "utils/to-base-64"
import { v4 as uuid } from "uuid"

export type AspectRatio = {
  x: number
  y: number
}

export type CropData = {
  x: number
  y: number
  scale: number
}

export type EditableImage = {
  base64url: string
  crop: CropData
  aspectRatio: AspectRatio
  originalAspectRatio: AspectRatio
}

export type ImageMap = Record<string, EditableImage>

export const createImageConfig = async (file: File): Promise<EditableImage> => {
  const base64url = await toBase64(file)
  const aspectRatio = await getImageAspectRatio(base64url)

  return {
    base64url,
    crop: { x: 0, y: 0, scale: 1 },
    aspectRatio,
    originalAspectRatio: aspectRatio,
  }
}

export type ImageAction =
  | { type: "ADD"; images: EditableImage[] }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "SET_CROP"; crop: Partial<CropData>; id: string }
  | { type: "SET_ASPECT_RATIO"; aspectRatio: AspectRatio; id: string }

export const imagesConfigReducer = (state: ImageMap, action: ImageAction) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "ADD": {
        const newImages = Object.fromEntries(action.images.map((image) => [uuid(), image]))
        Object.assign(draft, newImages)
        break
      }
      case "REMOVE": {
        delete draft[action.id]
        break
      }
      case "CLEAR": {
        const keys = Object.keys(draft)
        keys.forEach((k) => {
          delete draft[k]
        })
        break
      }
      case "SET_CROP": {
        Object.assign(draft[action.id].crop, action.crop)
        break
      }
      case "SET_ASPECT_RATIO": {
        Object.assign(draft[action.id].aspectRatio, action.aspectRatio)
        break
      }
      default:
        break
    }
  })
}

type ImagesConfigContextT = {
  images: ImageMap
  dispatch: Dispatch<ImageAction>
}
export const ImageConfigContext = createContext<ImagesConfigContextT>({ images: {}, dispatch: () => {} })

export const useImageConfigContext = () => useContext(ImageConfigContext)
