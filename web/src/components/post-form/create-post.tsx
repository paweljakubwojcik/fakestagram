import { Button, IconButton } from "components/buttons"
import { FileUpload } from "components/file-upload"
import { Modal } from "components/modal"
import { createImageConfig, ImageConfigContext, imagesConfigReducer } from "components/post-form/images-config-context"
import produce from "immer"
import Head from "next/head"
import { isEmpty } from "ramda"
import { ComponentProps, ComponentPropsWithoutRef, FC, useEffect, useReducer, useState } from "react"
import { ArrowLeft } from "react-feather"
import { toBase64 } from "utils/to-base-64"
import { v4 as uuid } from "uuid"
import { ImageCrop } from "./image-crop/image-crop"

type CreatePostProps = ComponentPropsWithoutRef<"div"> & ComponentProps<typeof Modal>

const STEPS = ["UPLOADING", "CROPPING", "META"] as const
type STEP = typeof STEPS[number]
type StepAction = { type: "NEXT" } | { type: "PREV" } | { type: "SET"; step: STEP }

const stepsReducer = (state: STEP, action: StepAction) => {
  const currentIndex = STEPS.findIndex((s) => s === state)
  switch (action.type) {
    case "NEXT":
      return STEPS[currentIndex + 1]
    case "PREV":
      return STEPS[currentIndex - 1]
    case "SET":
      return action.step
    default:
      return state
  }
}

export const CreatePostView: FC<CreatePostProps> = ({ className, onClose, ...props }) => {
  const [images, dispatch] = useReducer(imagesConfigReducer, {})

  const handleAddFiles = async (files: File[]) => {
    dispatch({ type: "ADD", images: await Promise.all(files.map((file) => createImageConfig(file))) })
    stepDispatch({ type: "SET", step: "CROPPING" })
  }

  const handleClose = () => {
    onClose?.()
    dispatch({ type: "CLEAR" })
  }

  const [step, stepDispatch] = useReducer(stepsReducer, STEPS[0])
  useEffect(() => {
    if (isEmpty(images)) {
      stepDispatch({ type: "SET", step: "UPLOADING" })
    }
  }, [images])

  const uploading = isEmpty(images) && step === "UPLOADING"
  const cropping = !isEmpty(images) && step === "CROPPING"
  const meta = step === "META"

  return (
    <ImageConfigContext.Provider value={{ images, dispatch }}>
      <Modal
        {...props}
        title={
          <>
            {uploading && "Create new post"}
            {cropping && (
              <div className="flex justify-between items-center">
                <IconButton onClick={() => stepDispatch({ type: "PREV" })}>
                  <ArrowLeft />
                </IconButton>
                <div>Crop</div>
                <Button className="py-1" onClick={() => stepDispatch({ type: "SET", step: "META" })}>
                  Next
                </Button>
              </div>
            )}
          </>
        }
        className="w-1/2 min-w-[350px] max-w-3xl min-h-fit max-h-full m-10 overflow-hidden"
        onClose={() => {
          if (isEmpty(images)) {
            handleClose()
          } else {
            Modal.open({
              onAccept: handleClose,
              title: "Abort creating new post ?",
              info: "If you close this dialog your changes will be lost.",
            })
          }
        }}
      >
        <Head>
          <title>Create new post | Fakestagram</title>
        </Head>

        {uploading && (
          <div className="p-4 w-full h-full">
            <FileUpload onChange={handleAddFiles} />
          </div>
        )}
        {cropping && <ImageCrop />}
        {meta && <div>Meta form</div>}
      </Modal>
    </ImageConfigContext.Provider>
  )
}
