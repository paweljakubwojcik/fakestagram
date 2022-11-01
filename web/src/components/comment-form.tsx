import { FC, ComponentPropsWithoutRef, useRef, useEffect } from "react"
import classnames from "classnames"
import { Button } from "./buttons"

type CommentFormProps = ComponentPropsWithoutRef<"div">

export const CommentForm: FC<CommentFormProps> = ({ className }) => {
    const resizableInput = useRef<HTMLTextAreaElement>(null)

    const maxHeight = 100
    const offset = 8

    useEffect(() => {
        const input = resizableInput.current
        const onInput = () => {
            if (resizableInput.current) {
                resizableInput.current.style.height = "1px"

                const height =
                    resizableInput.current.scrollHeight < maxHeight || !maxHeight
                        ? resizableInput.current.scrollHeight + offset
                        : maxHeight
                resizableInput.current.style.height = height + "px"
            }
        }

        input?.addEventListener("input", onInput)
        return () => input?.removeEventListener("input", onInput)
    }, [])

    return (
        <form
            className={classnames("flex items-center ", className)}
            onSubmit={(e) => {
                e.preventDefault()
            }}
        >
            <textarea
                ref={resizableInput}
                placeholder="Add comment..."
                className="bg-transparent resize-none focus:outline-none flex-1 h-[1.5em]"
            />
            <Button>Share</Button>
        </form>
    )
}
