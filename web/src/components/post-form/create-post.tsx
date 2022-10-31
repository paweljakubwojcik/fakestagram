import { FileUpload } from "components/file-upload"
import Head from "next/head"

import { Modal } from "components/modal"
import { MultiStepForm, MultiStepFormProps } from "components/multistep-form"
import { useCreatePostApi } from "hooks/use-create-post-api"
import { equals, isEmpty, pick } from "ramda"
import { ComponentProps, ComponentPropsWithoutRef, FC, useEffect, useReducer } from "react"
import { ImageCrop } from "./image-crop/image-crop"
import { PostMetaForm, PostMetaFormPanel } from "./post-meta-form"
import { usePostState } from "./post-state"

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

export const CreatePostView: FC<CreatePostProps> = ({ className, onClose, open, ...props }) => {
    const { images, aspectRatio } = usePostState(pick(["images", "aspectRatio"]), equals)
    const description = usePostState(
        (state) => state.description,
        () => true
    )
    const clear = usePostState((state) => state.clear)
    const addImages = usePostState((state) => state.add)
    const cropImages = usePostState((state) => state.cropImages)
    const clearCroppedImages = usePostState((state) => state.clearCroppedImages)

    const handleAddFiles = async (files: File[]) => {
        await addImages(files)
        stepDispatch({ type: "SET", step: "CROPPING" })
    }

    const handleClose = () => {
        clear()
        onClose?.()
    }

    const [step, stepDispatch] = useReducer(stepsReducer, STEPS[0])
    useEffect(() => {
        if (isEmpty(images)) {
            stepDispatch({ type: "SET", step: "UPLOADING" })
        }
    }, [images])

    const [createPost, { loading, error }] = useCreatePostApi()

    const steps: MultiStepFormProps["steps"] = {
        UPLOADING: {
            title: "Create new post",
            content: <FileUpload onChange={handleAddFiles} />,
        },
        CROPPING: {
            title: "Crop images",
            content: <ImageCrop className="animate-opacity duration-500" />,
            backAction: () => {
                Modal.open({
                    onAccept: () => clear(),
                    title: "Abort creating new post ?",
                    info: "If you close this dialog your changes will be lost.",
                })
            },
            nextAction: async () => {
                await cropImages()
                stepDispatch({ type: "SET", step: "META" })
            },
        },
        META: {
            title: "Say something about your photo",
            content: <PostMetaForm className="animate-opacity" />,
            rightPanelContent: <PostMetaFormPanel />,
            nextAction: async () => {
                try {
                    await createPost({ images, aspectRatio, description })
                    handleClose()
                } catch (e) {
                    alert("Error ")
                }
            },
            backAction: () => {
                clearCroppedImages()
                stepDispatch({ type: "PREV" })
            },
        },
    }

    return (
        <>
            {open && (
                <Head>
                    <title>Create new post | Fakestagram</title>
                </Head>
            )}
            <MultiStepForm
                open={open}
                steps={steps}
                currentStep={step}
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
                loading={loading}
                {...props}
            />
        </>
    )
}
