import create, { StateCreator } from "zustand"
import { devtools } from "zustand/middleware"
import { Point } from "types"
import { v4 as uuid } from "uuid"
import { getImageSize } from "utils/get-image-aspect-ratio"
import { asyncForEach } from "utils/async-for-each"
import { cropImage } from "./image-crop/utils"
import produce from "immer"

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
    add: (files: File[]) => Promise<void>
    append: (files: File[]) => Promise<void>
    remove: (id: string) => void
    clear: () => void
    setCurrentImage: (currentImage: string) => void
    setAspectRatio: (aspectRatio: AspectRatio) => void
    setDescription: (description: string) => void
    setCrop: (crop: Partial<CropData>) => void
    cropImages: () => Promise<void>
    clearCroppedImages: () => void
}

const createImageConfig = async (file: File): Promise<EditableImage> => {
    const originalUrl = URL.createObjectURL(file)
    const originalSize = await getImageSize(originalUrl)

    return {
        originalUrl,
        crop: { x: 0, y: 0, scale: 1 },
        originalSize,
    }
}

export const usePostState = create<PostFormSlice>()(
    devtools(
        (set, get) => ({
            images: {},
            currentImage: "",
            description: "",
            aspectRatio: { x: 1, y: 1 },
            add: async (files) => {
                const images = await Promise.all(files.map((file) => createImageConfig(file)))
                const newImages = Object.fromEntries(images.map((image) => [uuid(), image]))
                set({
                    images: newImages,
                    currentImage: Object.keys(newImages)[0],
                })
            },
            append: async (files) => {
                const images = await Promise.all(files.map((file) => createImageConfig(file)))
                const newImages = Object.fromEntries(images.map((image) => [uuid(), image]))
                const prevImages = get().images
                set({
                    images: { ...prevImages, ...newImages },
                    currentImage: Object.keys(newImages)[0],
                })
            },
            remove: (id) => {
                set(
                    produce<PostFormSlice>((draft) => {
                        // if we attempt to delete current pic, change it to nearest available pic
                        if (draft.currentImage === id) {
                            const keys = Object.keys(draft.images)
                            const currentImageIndex = keys.findIndex((i) => i === id)
                            draft.currentImage = keys[currentImageIndex > 0 ? currentImageIndex - 1 : keys.length + 1]
                        }
                        delete draft.images[id]
                    })
                )
            },
            clear: () =>
                set({
                    images: {},
                }),
            setCurrentImage: (currentImage) => {
                set({ currentImage })
            },
            setAspectRatio: (aspectRatio) => {
                set({ aspectRatio })
            },
            setDescription: (description) => set({ description }),
            setCrop: (crop) => {
                const { currentImage } = get()
                set(
                    produce<PostFormSlice>((draft) => {
                        Object.assign(draft.images[currentImage].crop, crop)
                    })
                )
            },
            cropImages: async () => {
                const { images, aspectRatio } = get()
                set(
                    await produce<PostFormSlice>(get(), async (draft) => {
                        await asyncForEach(
                            Object.entries(images),
                            async ([id, image]) =>
                                (draft.images[id].croppedUrl = await cropImage({ ...image, aspectRatio }))
                        )
                    })
                )
            },
            clearCroppedImages: () =>
                set(
                    produce<PostFormSlice>((draft) => {
                        Object.values(draft.images).forEach((v) => delete v.croppedUrl)
                    })
                ),
        }),
        // devtools options
        { name: "CreatePostState", enabled: process.env.NODE_ENV === "development" }
    )
)

const defaultImage = { crop: { x: 0, y: 0, scale: 1 }, originalSize: { height: 0, width: 0 } }
export const getCurrentImage = (state: PostFormSlice): EditableImage => state.images[state.currentImage] || defaultImage
