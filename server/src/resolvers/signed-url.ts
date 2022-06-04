import { generateV4UploadSignedUrl } from "src/lib/cloud-storage"
import { isAuth } from "src/middleware/is-auth"
import { Arg, Query, UseMiddleware } from "type-graphql"

export class SignedUrl {
  @UseMiddleware(isAuth)
  @Query(() => String)
  signedUrl(@Arg("filename", {}) filename: string) {
    return generateV4UploadSignedUrl({ filename })
  }
}
