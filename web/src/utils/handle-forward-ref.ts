import type { ForwardedRef } from "react"

export const handleForwardRef = <E>(ref: ForwardedRef<E> | undefined, el: E | null) => {
    if (ref && el) {
        if (typeof ref === 'function') {
            ref(el)
        } else {
            ref.current = el
        }
    }
}