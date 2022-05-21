import type { FC, ComponentPropsWithoutRef, ReactNode } from "react"
import classnames from "classnames"
import { createPortal } from "react-dom"
import { Card } from "./card"
import { IconButton } from "./buttons"
import { X } from "react-feather"

type ModalProps = Omit<ComponentPropsWithoutRef<"div">, "title"> & {
  open?: boolean
  title?: ReactNode
  onClose?: () => void
}

export const Modal: FC<ModalProps> = ({ className, children, open, title, onClose }) => {
  return open
    ? createPortal(
        <div
          className="fixed top-0 left-0 flex justify-center p-5 items-center w-screen h-screen bg-black/70 z-0 animate-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose?.()
            }
          }}
        >
          <IconButton className="fixed top-4 right-4 text-white text-lg" onClick={onClose}>
            <X className="w-8 h-8" />
          </IconButton>
          <Card className={classnames("animate-appear rounded-3xl overflow-hidden", className)}>
            <header className="border-b w-full p-4 py-2 text-center font-semibold">{title}</header>
            <div className="h-full w-full">{children}</div>
          </Card>
        </div>,
        document.body
      )
    : null
}