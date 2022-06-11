import { FC, ComponentPropsWithoutRef, useEffect } from "react"
import classnames from "classnames"
import { useIntersectionObserver } from "hooks/use-intersection-observer"
import { Loader } from "./loader"

type ListProps = ComponentPropsWithoutRef<"div"> & {
  onScrollToEnd?: () => void
  loading?: boolean
  enabled?: boolean
}

export const List: FC<ListProps> = ({ className, children, onScrollToEnd, enabled, loading }) => {
  const [ref, entry] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: "100px",
  })

  useEffect(() => {
    console.log(entry?.isIntersecting, enabled, loading)
    if (entry?.isIntersecting && enabled && !loading) {
      onScrollToEnd?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.isIntersecting])

  return (
    <div className={classnames("", className)}>
      {children}
      {loading && <Loader />}
      {Boolean(children) && <div id="dummy" className="absolute h-32" ref={ref} />}
    </div>
  )
}
