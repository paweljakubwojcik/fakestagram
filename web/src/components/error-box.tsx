import type { FC, ComponentPropsWithoutRef } from "react"
import classnames from "classnames"

type ErrorBoxProps = ComponentPropsWithoutRef<"div"> & {
  dismissible?: boolean
}

export const ErrorBox: FC<ErrorBoxProps> = ({ className, children }) => {
  return (
      <div className={classnames("border border-red-400 bg-rose-50 text-red-600 p-1 my-1 flex justify-between", className)}>
        <span>{children}</span>
        <div className="">X</div>
      </div>
  )
}
