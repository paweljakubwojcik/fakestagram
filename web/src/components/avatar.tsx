import type { FC, ComponentPropsWithoutRef } from "react"
import classnames from "classnames"
import Image from "next/image"
import sloth from "public/sloth.jpg"
import { UserFragmentFragment } from "@graphql"

type AvatarProps = ComponentPropsWithoutRef<"div"> & {
  user?: UserFragmentFragment
  size?: number
}

export const Avatar: FC<AvatarProps> = ({ className, user,  size = 24 }) => {
  return (
    <Image
      src={sloth}
      alt={`${user?.username} profile image`}
      width={size}
      height={size}
      className={classnames("rounded-full", className)}
    />
  )
}
