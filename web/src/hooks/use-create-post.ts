import { useCreatePostMutation, useSignedUrlsLazyQuery } from "@graphql"
import { AspectRatio, EditableImage } from "lib/redux/reducers/create-post"
import { useState } from "react"
import axios from "axios"

type CreatePostArguments = {
  images: Record<string, EditableImage>
  description: string
  aspectRatio: AspectRatio
}

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false)
  const [createPostMutation] = useCreatePostMutation({})
  const [getUploadUrls] = useSignedUrlsLazyQuery({})

  const [progress, setProgress] = useState(0)

  const createPost = async ({ aspectRatio, description, images }: CreatePostArguments) => {
    const filenames = Object.keys(images).map((id) => `fake_image_${id}.jpg`)
    const { data } = await getUploadUrls({
      variables: {
        filenames,
      },
    })
    if (!data) {
      throw Error()
    }
    await Promise.all(
      data.signedUrls.map((url, i) => {
        return new Promise<void>(async (res) => {
          const blobData = await fetch(Object.values(images)[i].croppedUrl!).then((res) => res.blob())
          const fileData = new File([blobData], "asasdasd", { type: "image/jpeg" })

          const data = new FormData()
          data.append("file", fileData)
          await axios.put(url, blobData, {
            headers: {
              "Content-Type": "image/jpeg",
            },
            onUploadProgress: (e: ProgressEvent) => {
              setProgress(e.loaded / e.total)
            },
          })
          res()
        })
      })
    )
    await createPostMutation({
      variables: {
        aspectRatio: `${aspectRatio.x}/${aspectRatio.y}`,
        description,
        images: filenames.map((filename) => `https://instaclone.imgix.net/${filename}`),
      },
    })
  }

  return [createPost, { loading, progress }] as const
}
