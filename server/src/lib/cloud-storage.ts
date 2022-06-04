import { Storage } from "@google-cloud/storage"

const storage = new Storage()

const BUCKET_NAME = "instaclone-posts"

type GenerateSignedUrlOptions = {
  filename: string
  contentType?: string
}

export async function generateV4UploadSignedUrl({
  filename,
  contentType = "image/jpeg",
}: GenerateSignedUrlOptions) {
  const [url] = await storage
    .bucket(BUCKET_NAME)
    .file(filename)
    .getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    })

  return url
}
