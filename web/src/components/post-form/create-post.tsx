import classnames from "classnames"
import { Button, IconButton } from "components/buttons"
import { FileUpload } from "components/file-upload"
import { Modal } from "components/modal"
import { useAppDispatch, useAppSelector } from "lib/redux/hooks"
import { postFormActions, postFormThunks } from "lib/redux/reducers/create-post"
import Head from "next/head"
import { isEmpty } from "ramda"
import { ComponentProps, ComponentPropsWithoutRef, FC, useEffect, useReducer, useState } from "react"
import { ArrowLeft } from "react-feather"
import { ImageCrop } from "./image-crop/image-crop"
import { cropImage } from "./image-crop/utils"
import { PostMetaForm } from "./post-meta-form"

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
  const { setCroppedUrl, clear } = postFormActions
  const images = useAppSelector((state) => state.postForm.images)
  const dispatch = useAppDispatch()

  const handleAddFiles = async (files: File[]) => {
    dispatch(postFormThunks.addImages(files))
    stepDispatch({ type: "SET", step: "CROPPING" })
  }

  const handleClose = () => {
    dispatch(clear())
    onClose?.()
  }

  const [step, stepDispatch] = useReducer(stepsReducer, STEPS[0])
  useEffect(() => {
    if (isEmpty(images)) {
      stepDispatch({ type: "SET", step: "UPLOADING" })
    }
  }, [images])

  const uploading = step === "UPLOADING"
  const cropping = step === "CROPPING"
  const meta = step === "META"

  const [loading, setLoading] = useState(false)

  const headers: Record<STEP, { title: string; backAction?: () => void; nextAction?: () => void }> = {
    UPLOADING: {
      title: "Create new post",
    },
    CROPPING: {
      title: "Crop images",
      backAction: () => {
        Modal.open({
          onAccept: () => dispatch(clear()),
          title: "Abort creating new post ?",
          info: "If you close this dialog your changes will be lost.",
        })
      },
      nextAction: async () => {
        setLoading(true)
        await Promise.all(
          Object.entries(images).map(([id, image]) => {
            return new Promise(async (res) => {
              dispatch(setCroppedUrl({ url: await cropImage(image), id }))
              res(true)
            })
          })
        )
        stepDispatch({ type: "SET", step: "META" })
        setLoading(false)
      },
    },
    META: {
      title: "Say something about your photo",
      nextAction: () => {
        console.log("publish")
      },
      backAction: () => stepDispatch({ type: "PREV" }),
    },
  }

  const { title, backAction, nextAction } = headers[step]

  return (
    <Modal
      {...props}
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
      className="w-full max-w-3xl min-h-fit max-h-full m-10 overflow-hidden"
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
        <div className="p-4 w-full h-full aspect-square">
          <FileUpload onChange={handleAddFiles} />
        </div>
      )}
      {cropping && <ImageCrop className="animate-opacity duration-500" />}
      {meta && <PostMetaForm className="animate-opacity" />}
    </Modal>
  )
}
