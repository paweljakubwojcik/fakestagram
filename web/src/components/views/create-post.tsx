import { Button, IconButton } from "components/buttons"
import { FileUpload } from "components/file-upload"
import { Modal } from "components/modal"
import Head from "next/head"
import { isEmpty } from "ramda"
import { v4 as uuid } from "uuid"
import { ComponentProps, ComponentPropsWithoutRef, FC, useState } from "react"
import { toBase64 } from "utils/to-base-64"
import { EditableImage } from "./types/editable-image"
import { ImageCrop } from "./image-crop"
import { ArrowLeft } from "react-feather"

type CreatePostProps = ComponentPropsWithoutRef<"div"> & ComponentProps<typeof Modal>

type ImageMap = Record<string, EditableImage>

export const CreatePostView: FC<CreatePostProps> = ({ className, onClose, ...props }) => {
  const [images, setImages] = useState<ImageMap>({})
  const [closingModal, setClosingModal] = useState(false)

  const handleAddFiles = async (files: File[]) => {
    const imageUrls = await Promise.all(files.map((file) => toBase64(file)))
    const images = Object.fromEntries(imageUrls.map((base64url) => [uuid(), { base64url }]))
    setImages(images)
  }

  const handleClose = () => {
    onClose?.()
    setImages({})
    setClosingModal(false)
  }

  const uploading = isEmpty(images)
  const cropping = !isEmpty(images)

  return (
    <>
      <Modal
        {...props}
        title={
          <>
            {uploading && "Create new post"}
            {cropping && (
              <div className="flex justify-between items-center">
                <IconButton>
                  <ArrowLeft />
                </IconButton>
                <div>Crop</div>
                <Button className="py-1">Next</Button>
              </div>
            )}
          </>
        }
        className="w-1/2 min-w-[350px] max-w-3xl min-h-fit max-h-full m-10 overflow-hidden"
        onClose={() => {
          if (isEmpty(images)) {
            handleClose()
          } else {
            setClosingModal(true)
          }
        }}
      >
        <Head>
          <title>Create new post | Fakestagram</title>
        </Head>

        {uploading && (
          <div className="p-4 w-full h-full">
            <FileUpload onChange={handleAddFiles} />{" "}
          </div>
        )}
        {cropping && <ImageCrop images={images} />}

        <Modal
          open={closingModal}
          title={
            <div className="p-4">
              <h3 className="font-semibold">Abort creating new post ? </h3>
              <h4 className="font-thin text-gray-500 text-base">
                {"If you close this dialog your changes will be lost."}
              </h4>
            </div>
          }
          onClose={() => setClosingModal(false)}
        >
          <div className="flex flex-col">
            <Button onClick={handleClose} className="border-b !py-4 !text-red-600">
              Abort
            </Button>
            <Button onClick={() => setClosingModal(false)} className="!py-4">
              Cancel
            </Button>
          </div>
        </Modal>
      </Modal>
    </>
  )
}
