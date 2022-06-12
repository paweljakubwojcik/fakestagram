import classnames from "classnames"
import { ComponentProps, ComponentPropsWithoutRef, FC, ReactNode, useEffect, useState } from "react"
import { Modal } from "./modal"

import { Button, IconButton } from "components/buttons"
import { FileUpload } from "components/file-upload"
import Head from "next/head"
import { isEmpty } from "ramda"
import { ArrowLeft } from "react-feather"

type Step = {
  title: string
  nextAction?: () => void
  backAction?: () => void
  content: ReactNode
  rightPanelContent?: ReactNode
}

export type MultiStepFormProps = ComponentProps<typeof Modal> & {
  steps: Record<string, Step>
  currentStep: string
}

const MAIN_WIDTH = 600

export const MultiStepForm: FC<MultiStepFormProps> = ({
  className,
  children,
  steps,
  currentStep,
  onClose,
  open,
  ...props
}) => {
  const height = MAIN_WIDTH
  const [width, setWidth] = useState(MAIN_WIDTH)

  const { content, nextAction, title, backAction, rightPanelContent } = steps[currentStep]

  useEffect(() => {
    if (rightPanelContent) {
      setWidth(900)
    } else {
      setWidth(MAIN_WIDTH)
    }
  }, [rightPanelContent])

  useEffect(() => {
    if (!open) {
      setWidth(MAIN_WIDTH)
    }
  }, [open])

  return (
    <Modal
      {...props}
      open={open}
      style={{ width }}
      title={
        <>
          <div className="flex justify-between items-center">
            <IconButton onClick={backAction} className={classnames(!backAction && "invisible")}>
              <ArrowLeft />
            </IconButton>
            <div>{title}</div>
            <Button onClick={nextAction} className={classnames("py-1", !nextAction && "invisible")}>
              Next
            </Button>
          </div>
        </>
      }
      className="min-h-fit max-h-full m-10 overflow-hidden transition-[width] duration-500"
      onClose={() => {
        onClose?.()
      }}
    >
      <div className="flex" style={{ width: MAIN_WIDTH + 300 }}>
        <div className="overflow-hidden w-full" style={{ height, width: MAIN_WIDTH }}>
          {content}
        </div>
        <div style={{ width: 300 }} className="border-solid border-l border-gray-300/20">
          {rightPanelContent}
        </div>
      </div>
    </Modal>
  )
}
