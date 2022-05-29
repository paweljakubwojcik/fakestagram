import { Button } from "components/buttons"
import { BaseModal } from "./base-modal"

export type ConfirmationModalProps = {
  title: string
  onAccept: () => void
  onCancel?: () => void
  onClose?: () => void
  info?: string
  open: boolean
}

export const ConfirmationModal = ({ onAccept, onCancel, title, info, open, onClose }: ConfirmationModalProps) => {
  return (
    <BaseModal
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
    </BaseModal>
  )
}
