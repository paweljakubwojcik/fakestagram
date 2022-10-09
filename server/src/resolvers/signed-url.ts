import { getUploadSignedUrl } from "src/lib/s3/get-upload-signed-url"
import { isAuth } from "src/middleware/is-auth"
import { Arg, Query, UseMiddleware } from "type-graphql"

export class SignedUrl {
    @UseMiddleware(isAuth)
    @Query(() => String)
    signedUrl(@Arg("filename", {}) filename: string) {
        return getUploadSignedUrl({ filename })
    }

    @UseMiddleware(isAuth)
    @Query(() => [String])
    signedUrls(@Arg("filenames", () => [String]) filenames: string[]) {
        return filenames.map((filename) => getUploadSignedUrl({ filename }))
    }
}
