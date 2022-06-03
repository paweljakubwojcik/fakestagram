import type { ForwardedRef } from "react"
import { handleForwardRef } from "./handle-forward-ref"

/**
 * Merge react refs in safe way
 */
export function mergeRefs<E extends HTMLElement | null>(...refs: Array<ForwardedRef<E> | undefined>) {
  return (e: E | null) => {
    refs.forEach((ref) => {
      handleForwardRef(ref, e)
    })
  }
}
