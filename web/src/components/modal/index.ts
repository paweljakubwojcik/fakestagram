import { BaseModal } from "./base-modal"
import { openModal } from "./open-modal"
export * from "./confirmation-modal"

export const Modal = Object.assign(BaseModal, {
  open: openModal,
})

