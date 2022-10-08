import { useCreatePostMutation, useSignedUrlsLazyQuery } from "@graphql"
import { useState } from "react"
import axios from "axios"
import { asyncForEach } from "utils/async-for-each"
import { AspectRatio, EditableImage } from "components/post-form/post-state"

type CreatePostArguments = {
  images: Record<string, EditableImage>
  description: string
  aspectRatio: AspectRatio
}

export const useCreatePostApi = () => {
  const [loading, setLoading] = useState(false)
  const [createPostMutation] = useCreatePostMutation({
    refetchQueries: ["Posts"],
  })
  const [getUploadUrls] = useSignedUrlsLazyQuery({})

  const [progress, setProgress] = useState(0)

  const createPost = async ({ aspectRatio, description, images }: CreatePostArguments) => {
    setLoading(true)
    const filenames = Object.keys(images).map((id) => `fake_image_${id}.jpg`)
    const { data } = await getUploadUrls({
      variables: {
        filenames,
      },
    })
    if (!data) {
      throw Error()
    }
    await asyncForEach(data.signedUrls, async (url, i) => {
      const blobData = await fetch(Object.values(images)[i].croppedUrl!).then((res) => res.blob())
      const fileData = new File([blobData], "this name does not  matter at all", { type: "image/jpeg" })

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
    })
    await createPostMutation({
      variables: {
        aspectRatio: `${aspectRatio.x}/${aspectRatio.y}`,
        description,
        images: filenames.map((filename) => `https://instaclone.imgix.net/${filename}`),
      },
    })
    setLoading(false)
  }

  return [createPost, { loading, progress }] as const
}
