import { PutObjectCommand } from "@aws-sdk/client-s3"
import { BUCKET_NAME, s3 as s3Client } from "./s3"
import { v4 as uuid } from "uuid"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

type GenerateSignedUrlOptions = {
    filename: string
    contentType?: string
}

export function getUploadSignedUrl({ filename }: GenerateSignedUrlOptions): Promise<string> {
    // Create a command to put the object in the S3 bucket.
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: `${uuid()}_${filename}`,
    })
    // Create the presigned URL.
    return getSignedUrl(s3Client as any, command as any, {
        expiresIn: 3600,
    })
}
