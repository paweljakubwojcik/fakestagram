import { createSlice, Dispatch, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { Point } from "types"
import { getImageAspectRatio } from "utils/get-image-aspect-ratio"
import { toBase64 } from "utils/to-base-64"
import { RootState } from "../store"
import { v4 as uuid } from "uuid"

export type AspectRatio = Point

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
  originalSize?: Point
  croppedUrl?: string
}

export type PostFormSlice = {
  images: Record<string, EditableImage>
  currentImage: string
}

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

const emptyImageConfig = {
  aspectRatio: { x: 0, y: 0 },
  crop: { x: 0, y: 0, scale: 0 },
  originalAspectRatio: { x: 0, y: 0 },
}

const initialState: PostFormSlice = {
  images: {},
  currentImage: "",
}

export const { reducer: postFormReducer, actions: postFormActions } = createSlice({
  name: "postForm",
  initialState,
  reducers: {
    add: (draft, { payload: { images } }: PayloadAction<{ images: EditableImage[] }>) => {
      const newImages = Object.fromEntries(images.map((image) => [uuid(), image]))
      Object.assign(draft.images, newImages)
      draft.currentImage = Object.keys(newImages)[0]
    },
    remove: (draft, { payload: { id } }: PayloadAction<{ id: string }>) => {
      // if we attemt to delete current pic, change it to nearest avaiable pic
      if (draft.currentImage === id) {
        const keys = Object.keys(draft.images)
        const currentImageIndex = keys.findIndex((i) => i === id)
        draft.currentImage = keys[currentImageIndex > 0 ? currentImageIndex - 1 : keys.length + 1]
      }
      delete draft.images[id]
    },
    clear: (draft) => {
      draft.images = {}
    },
    setCurrentImage: (draft, { payload: { id } }: PayloadAction<{ id: string }>) => {
      draft.currentImage = id
    },
    setCrop: (draft, { payload: { crop } }: PayloadAction<{ crop: Partial<CropData> }>) => {
      Object.assign(draft.images[draft.currentImage].crop, crop)
    },
    setAspectRatio: (draft, { payload: { aspectRatio } }: PayloadAction<{ aspectRatio: AspectRatio }>) => {
      Object.assign(draft.images[draft.currentImage].aspectRatio, aspectRatio)
    },
    setCroppedUrl: (draft, { payload: { url, id } }: PayloadAction<{ id: string; url: string }>) => {
      draft.images[id].croppedUrl = url
    },
  },
})

export const postFormSelectors = {
  getCurrentImage: (state: RootState) => {
    return state.postForm.images[state.postForm.currentImage] || emptyImageConfig
  },
  getImages: (state: RootState) => {
    return state.postForm.images
  },
}

export const postFormThunks = {
  addImages: (files: File[]) => {
    return async (dispatch: Dispatch) => {
      dispatch(
        postFormActions.add({
          images: await Promise.all(files.map((file) => createImageConfig(file))),
        })
      )
    }
  },
}
