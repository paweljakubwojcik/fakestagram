import { createSlice, Dispatch, PayloadAction, ThunkAction } from "@reduxjs/toolkit"
import { Point } from "types"
import { getImageSize } from "utils/get-image-aspect-ratio"
import { toBase64 } from "utils/to-base-64"
import { RootState } from "../store"
import { v4 as uuid } from "uuid"
import { cropImage } from "components/post-form/image-crop/utils"
import { asyncForEach } from "utils/async-for-each"

export type AspectRatio = Point

export type Size = { width: number; height: number }

export type CropData = {
  x: number
  y: number
  scale: number
}

export type EditableImage = {
  originalUrl: string
  originalSize: Size
  crop: CropData
  croppedUrl?: string
}

export type PostFormSlice = {
  images: Record<string, EditableImage>
  currentImage: string
  description: string
  aspectRatio: AspectRatio
}

export const createImageConfig = async (file: File): Promise<EditableImage> => {
  const originalUrl = URL.createObjectURL(file)
  const originalSize = await getImageSize(originalUrl)

  return {
    originalUrl,
    crop: { x: 0, y: 0, scale: 1 },
    originalSize,
  }
}

const emptyImageConfig: EditableImage = {
  crop: { x: 0, y: 0, scale: 0 },
  originalSize: { width: 0, height: 0 },
  originalUrl: "",
}

const initialState: PostFormSlice = {
  images: {},
  currentImage: "",
  description: "",
  aspectRatio: { x: 1, y: 1 },
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
      // if we attempt to delete current pic, change it to nearest available pic
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
      draft.aspectRatio = aspectRatio
    },
    setCroppedUrl: (draft, { payload: { url, id } }: PayloadAction<{ id: string; url: string }>) => {
      draft.images[id].croppedUrl = url
    },
    clearCroppedImages: (draft) => {
      Object.values(draft.images).forEach((v) => delete v.croppedUrl)
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
  cropImages: () => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
      const { images, aspectRatio } = getState().postForm
      await asyncForEach(Object.entries(images), async ([id, image]) =>
        dispatch(postFormActions.setCroppedUrl({ url: await cropImage({ ...image, aspectRatio }), id }))
      )
    }
  },
}
