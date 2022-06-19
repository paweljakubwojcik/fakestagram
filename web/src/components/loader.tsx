import type { FC, ComponentPropsWithoutRef } from "react"
import classnames from "classnames"
import LoaderSvg from "public/loader.svg"

type LoaderProps = ComponentPropsWithoutRef<"div">

export const Loader: FC<LoaderProps> = ({ className }) => {
  return (
    <div className={classnames("flex justify-center items-center", className)}>
      <LoaderSvg className="fill-instagradient" />
    </div>
  )
}
