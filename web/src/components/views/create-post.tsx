import { Button, IconButton } from "components/buttons"
import { FileUpload } from "components/file-upload"
import { Modal } from "components/modal"
import Head from "next/head"
import { isEmpty } from "ramda"
import { v4 as uuid } from "uuid"
import { ComponentProps, ComponentPropsWithoutRef, FC, ReducerAction, useEffect, useReducer, useState } from "react"
import { toBase64 } from "utils/to-base-64"
import { AspectRatio, CropData, EditableImage } from "./types/editable-image"
import { ImageCrop } from "./image-crop"
import { ArrowLeft } from "react-feather"
import produce from "immer"

type CreatePostProps = ComponentPropsWithoutRef<"div"> & ComponentProps<typeof Modal>

type ImageMap = Record<string, EditableImage>

const getImageAspectRatio = (url: string) => {
  const image = document.createElement("img")
  image.src = url

  return new Promise<{ x: number; y: number }>((res, rej) => {
    image.addEventListener("load", () => {
      res({ x: image.width, y: image.height })
    })
    image.addEventListener("error", () => {
      rej("Cannot read dimensions of an image")
    })
  })
}

const createImageConfig = async (file: File): Promise<EditableImage> => {
  const base64url = await toBase64(file)
  const aspectRatio = await getImageAspectRatio(base64url)

  return {
    base64url,
    crop: { x: 0, y: 0, scale: 1 },
    aspectRatio,
    originalAspectRatio: aspectRatio,
  }
}

export type ImageAction =
  | { type: "ADD"; images: EditableImage[] }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "SET_CROP"; crop: Partial<CropData>; id: string }
  | { type: "SET_ASPECT_RATIO"; aspectRatio: AspectRatio; id: string }

const imagesConfigReducer = (state: ImageMap, action: ImageAction) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "ADD": {
        const newImages = Object.fromEntries(action.images.map((image) => [uuid(), image]))
        Object.assign(draft, newImages)
        break
      }
      case "REMOVE": {
        delete draft[action.id]
        break
      }
      case "CLEAR": {
        const keys = Object.keys(draft)
        keys.forEach((k) => {
          delete draft[k]
        })
        break
      }
      case "SET_CROP": {
        Object.assign(draft[action.id].crop, action.crop)
        break
      }
      case "SET_ASPECT_RATIO": {
        Object.assign(draft[action.id].aspectRatio, action.aspectRatio)
        break
      }
      default:
        break
    }
  })
}

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

  const [closingModal, setClosingModal] = useState(false)

  const handleAddFiles = async (files: File[]) => {
    dispatch({ type: "ADD", images: await Promise.all(files.map((file) => createImageConfig(file))) })
    stepDispatch({ type: "SET", step: "CROPPING" })
  }

  const handleClose = () => {
    onClose?.()
    dispatch({ type: "CLEAR" })
    setClosingModal(false)
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
    <>
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
        {cropping && <ImageCrop images={images} dispatch={dispatch} />}
        {meta && <div>Meta form</div>}
      </Modal>
    </>
  )
}
