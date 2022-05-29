import { createRoot } from "react-dom/client"
import { ConfirmationModal, ConfirmationModalProps } from "./confirmation-modal"

type OpenModalOptions = Omit<ConfirmationModalProps, "open">
/**
 * Static method that allow convinient acces to modal in callbacks
 */
export const openModal = ({ onClose, ...props }: OpenModalOptions) => {
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
