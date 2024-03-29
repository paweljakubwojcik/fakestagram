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
        const setDragLeave = (e: DragEvent) => !e.relatedTarget && setDropping(false)

        document.addEventListener("dragenter", setDragEnter)
        document.addEventListener("dragleave", setDragLeave)
        return () => {
            document.removeEventListener("dragenter", setDragEnter)
            document.removeEventListener("dragleave", setDragLeave)
        }
    }, [])

    return (
        <label className={classnames("flex flex-col items-center h-full justify-center", className)}>
            <div className={classnames(dropping && "child:fill-instagradient child:text-white")}>
                <Files />
            </div>
            <span className="text-xl font-thin my-3">Drag photos and videos here</span>
            <Button mode="primary" baseClassName="my-2" onClick={() => inputRef.current?.click()}>
                Upload file
            </Button>
            <input
                type="file"
                name="file-upload"
                className={classnames(
                    "absolute w-full h-full opacity-0 -z-50 pointer-events-none",
                    dropping && "z-50 pointer-events-auto"
                )}
                ref={inputRef}
                onChange={(e) => {
                    setDropping(false)
                    onChange(Array.from(e.target.files || []))
                }}
                multiple
                accept="image/*"
            />
        </label>
    )
}
