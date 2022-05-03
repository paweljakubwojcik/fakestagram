import { readdirSync } from "fs"
import path from "path"
import { NonEmptyArray } from "type-graphql"

const RESOLVERS_DIR = path.join(__dirname)
/* dzieki temu resolvery same sie dodają */
const resolvers = readdirSync(RESOLVERS_DIR)
  .filter((dir) => dir !== "index.js")
  .filter((dir) => !dir.includes(".map"))
  .reduce((res, dir) => {
    const thisPathResolvers = Object.entries(
      require(path.join(RESOLVERS_DIR, dir))
    )
    thisPathResolvers.forEach(([name]) =>
      console.log(`[resolver discovery]: ${name}`)
    )

    return [
      ...res,
      ...thisPathResolvers.map(([_k, v]) => v),
    ] as NonEmptyArray<Function>
  }, [] as unknown as NonEmptyArray<Function>)

export { resolvers }
