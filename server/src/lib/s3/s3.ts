import { S3Client } from "@aws-sdk/client-s3"

export const BUCKET_NAME = "fakestagram-bucket"
const REGION = "eu-central-1"

export const s3 = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.AMAZON_S3_ID!,
        secretAccessKey: process.env.AMAZON_S3_SECRET!,
    },
})
