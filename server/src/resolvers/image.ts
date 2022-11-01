import { deleteObject } from "src/lib/s3/delete-object"
import { isAuth } from "src/middleware/is-auth"
import { Arg, Mutation, UseMiddleware } from "type-graphql"

export class ImageResolver {
    @UseMiddleware(isAuth)
    @Mutation(() => String)
    removeImage(@Arg("filename", {}) filename: string) {
        return deleteObject(filename)
    }
}
