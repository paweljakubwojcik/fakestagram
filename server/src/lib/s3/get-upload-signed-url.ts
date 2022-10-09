import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { BUCKET_NAME, s3 } from "./s3"

type GenerateSignedUrlOptions = {
    filename: string
    contentType?: string
}

export async function getUploadSignedUrl({
    filename,
}: GenerateSignedUrlOptions) {
    const { url } = await createPresignedPost(s3, {
        Bucket: BUCKET_NAME,
        Key: `uploads/${filename}`,
        Expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    })

    return url
}
