import { Button } from "components/buttons"
import { FileUpload } from "components/file-upload"
import { Modal } from "components/modal"
import Head from "next/head"
import { isEmpty } from "ramda"
import { ComponentProps, ComponentPropsWithoutRef, FC, useState } from "react"

type CreatePostProps = ComponentPropsWithoutRef<"div"> & ComponentProps<typeof Modal>

export const CreatePostView: FC<CreatePostProps> = ({ className, onClose, ...props }) => {
  const [files, setFiles] = useState<File[]>([])
  const [closingModal, setClosingModal] = useState(false)

  const handleClose = () => {
    onClose?.()
    setFiles([])
    setClosingModal(false)
  }

  return (
    <>
      <Modal
        {...props}
        title={"Create new post"}
        className="aspect-square w-1/2 max-w-lg min-w-[350px]  min-h-fit max-h-full m-10 overflow-hidden"
        onClose={() => {
          if (isEmpty(files)) {
            handleClose()
          } else {
            setClosingModal(true)
          }
        }}
      >
        <Head>
          <title>Create new post | Fakestagram</title>
        </Head>
        <div className="p-4 w-full h-full">
          <FileUpload onChange={setFiles} />
        </div>
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
