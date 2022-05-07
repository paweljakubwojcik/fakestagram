import { FC, ComponentPropsWithoutRef, useState } from "react"
import classnames from "classnames"
import { X } from "react-feather"

type ErrorBoxProps = ComponentPropsWithoutRef<"div"> & {
  dismissible?: boolean
}

export const ErrorBox: FC<ErrorBoxProps> = ({ className, children }) => {
  const [closed, setClosed] = useState(false)
  const onClose = () => {}

  return closed ? null : (
    <div
      className={classnames("border border-red-400 bg-rose-50 text-red-600 p-1 my-1 flex justify-between", className)}
    >
      <span>{children}</span>
      <button className="" onClick={() => setClosed(true)}><X size={14} /></button>
    </div>
  )
}
