import { FC, ComponentPropsWithoutRef, useEffect, useState, useRef } from "react"
import classnames from "classnames"
import { Files } from "./svg/files"
import { Button } from "./buttons"

type FileUploadProps = Omit<ComponentPropsWithoutRef<"div">, "onChange"> & {
  onChange: (files: File[]) => void
}

export const FileUpload: FC<FileUploadProps> = ({ className, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dropping, setDropping] = useState(false)

  useEffect(() => {
    const setDragEnter = () => setDropping(true)
    const setDragLeave = (e: DragEvent) => (!e.relatedTarget && setDropping(false))

    document.addEventListener("dragenter", setDragEnter)
    document.addEventListener("dragleave", setDragLeave)
    return () => {
      document.removeEventListener("dragenter", setDragEnter)
      document.removeEventListener("dragleave", setDragLeave)
    }
  }, [])

  return (
    <label htmlFor="inputid" className={classnames("flex flex-col items-center h-full justify-center", className)}>
      <div className={classnames(dropping && "child:instagradient child:text-white")}>
        <Files />
      </div>
      <span className="text-xl font-thin my-3">Przeciągnij zdjęcia i filmy tutaj</span>
      <Button mode="primary" className="my-2" onClick={() => inputRef.current?.click()}>
        Wybierz z komputera
      </Button>
      <input
        type="file"
        name="inputid"
        className={classnames("absolute w-full h-full opacity-0 -z-50 pointer-events-none", dropping && "z-50 pointer-events-auto")}
        ref={inputRef}
        onChange={(e) => {
          setDropping(false)
          onChange(Array.from(e.target.files || []))
        }}
      />
    </label>
  )
}
