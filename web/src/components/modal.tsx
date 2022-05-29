import type { FC, ComponentPropsWithoutRef, ReactNode } from "react"
import classnames from "classnames"
import { createPortal } from "react-dom"
import { createRoot } from "react-dom/client"
import { Card } from "./card"
import { Button, IconButton } from "./buttons"
import { X } from "react-feather"
import useResizeObserver from "use-resize-observer"
import { v4 as uuid } from "uuid"

type ModalProps = Omit<ComponentPropsWithoutRef<"div">, "title"> & {
  open?: boolean
  title?: ReactNode
  onClose?: () => void
}

const InnerModal: FC<ModalProps> = ({ className, children, open, title, onClose }) => {
  const { height = 1, ref } = useResizeObserver()

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
          <Card className={classnames("animate-appear rounded-3xl overflow-hidden dark:!bg-gray-800", className)}>
            <header ref={ref} className="border-b w-full p-4 py-2 text-center font-semibold dark:text-white">
              {title}
            </header>
            <div className="w-full" style={{ minHeight: `calc(100% - ${height}px)` }}>
              {children}
            </div>
          </Card>
        </div>,
        document.body
      )
    : null
}

type ConfirmationModalProps = {
  title: string
  onAccept: () => void
  onCancel?: () => void
  onClose?: () => void
  info?: string
  open: boolean
}

const ConfirmationModal = ({ onAccept, onCancel, title, info, open, onClose }: ConfirmationModalProps) => {
  return (
    <Modal
      open={open}
      title={
        <div className="p-4">
          <h3 className="font-semibold">{title}</h3>
          <h4 className="font-thin text-gray-500 text-base">{info}</h4>
        </div>
      }
      onClose={onClose}
    >
      <div className="flex flex-col">
        <Button
          onClick={() => {
            onAccept()
            onClose?.()
          }}
          className="border-b !py-4 !error-text"
        >
          Ok
        </Button>
        <Button
          onClick={() => {
            onCancel?.()
            onClose?.()
          }}
          className="!py-4"
        >
          Cancel
        </Button>
      </div>
    </Modal>
  )
}

type OpenModalOptions = Omit<ConfirmationModalProps, "open">
/**
 * Static method that allow convinient acces to modal in callbacks
 */
const openModal = ({ onClose, ...props }: OpenModalOptions) => {
  const modalContainer = document.createElement("div")
  document.body.appendChild(modalContainer)
  const root = createRoot(modalContainer)
  root.render(
    <ConfirmationModal
      open={true}
      {...props}
      onClose={() => {
        onClose?.()
        root.unmount()
        modalContainer.remove()
      }}
    />
  )
}

export const Modal = Object.assign(InnerModal, {
  open: openModal,
})
