import { Storage } from "@google-cloud/storage"
import { equals } from "ramda"

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

// The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// The origin for this CORS config to allow requests from
const origin = ["http://localhost:3005"]

// The response header to share across origins
const responseHeader = "Content-Type"

// The maximum amount of time the browser can make requests before it must
// repeat preflighted requests
const maxAgeSeconds = 3600

// The name of the method
// See the HttpMethod documentation for other HTTP methods available:
// https://cloud.google.com/appengine/docs/standard/java/javadoc/com/google/appengine/api/urlfetch/HTTPMethod
const method = "PUT"

export async function configureBucketCors() {
  const [metadata] = await storage.bucket(BUCKET_NAME).getMetadata()
  const configuredCorsOrigin = metadata.cors[0].origin 
  if (!equals(configuredCorsOrigin, origin)) {
    await storage.bucket(BUCKET_NAME).setCorsConfiguration([
      {
        maxAgeSeconds,
        method: [method],
        origin: origin,
        responseHeader: [responseHeader],
      },
    ])

    console.log(`Bucket ${BUCKET_NAME} was updated with a CORS config
      to allow ${method} requests from ${origin} sharing
      ${responseHeader} responses across origins`)
  }
}
