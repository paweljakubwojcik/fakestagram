import { useCreatePostMutation, useSignedUrlsLazyQuery, useRemoveImageMutation } from "@graphql"
import { useState } from "react"
import axios from "axios"
import { asyncForEach } from "utils/async-for-each"
import { AspectRatio, EditableImage } from "features/create-post/post-state"

type NewImageInfo = {
    images: Record<string, EditableImage>
    description: string
    aspectRatio: AspectRatio
}

type Options = {
    onUploadProgress?: (progress: number) => void
    onError?: (e: any) => void
}

type CreatePostFunction = (imageInfo: NewImageInfo, options?: Options) => Promise<void>

const getFileNameFromSignedUrl = (url: string) => new URL(url).pathname

export const useCreatePostApi = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>(null)

    const [createPostMutation] = useCreatePostMutation({
        refetchQueries: ["Posts"],
    })
    const [getUploadUrls] = useSignedUrlsLazyQuery({})

    const [removeImage] = useRemoveImageMutation({})

    const createPost: CreatePostFunction = async (
        { aspectRatio, description, images },
        { onUploadProgress, onError } = {}
    ) => {
        /**
         * filenames returned by signed urls
         */
        let filenames: string[] = []

        try {
            setLoading(true)

            // get signed urls
            const { data } = await getUploadUrls({
                variables: {
                    filenames: Object.keys(images).map((id) => `fake_image_${id}.jpg`),
                },
            })
            if (!data) {
                throw Error("Something went wrong - data is null ")
            }

            // upload files
            await asyncForEach(data.signedUrls, async (url, i) => {
                const blobData = await fetch(Object.values(images)[i].croppedUrl!).then((res) => res.blob())
                const fileData = new File([blobData], "THIS_NAME_DOES_NOT_DO_ANYTHING", { type: "image/jpeg" })

                const data = new FormData()
                data.append("file", fileData)
                await axios.put(url, blobData, {
                    headers: {
                        "Content-Type": "image/jpeg",
                    },
                    onUploadProgress: (e: ProgressEvent) => {
                        onUploadProgress?.(e.loaded / e.total)
                    },
                })
            })

            filenames = data.signedUrls.map(getFileNameFromSignedUrl)

            // create post
            await createPostMutation({
                variables: {
                    aspectRatio: `${aspectRatio.x}/${aspectRatio.y}`,
                    description,
                    images: filenames,
                },
            })
        } catch (e) {
            setError(e)
            onError?.(e)

            // rollback all changes
            // delete image if any was uploaded
            await asyncForEach(filenames, (filename) => removeImage({ variables: { filename } }))
        } finally {
            setLoading(false)
        }
    }

    return [createPost, { loading, error }] as const
}
