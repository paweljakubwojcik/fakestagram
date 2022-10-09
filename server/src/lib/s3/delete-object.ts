import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { BUCKET_NAME, s3 } from "./s3"

export const deleteObject = (path: string) => {
    return s3.send(
        new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: path,
        })
    )
}
