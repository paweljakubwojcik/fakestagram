import classnames from "classnames"
import { IconButton } from "components/buttons"
import { ReactNode, Dispatch, SetStateAction, useRef, useEffect } from "react"
import { type Icon } from "react-feather"

type EditMenuProps = {
  Icon: Icon
  className?: string
  children: ReactNode
  setOpenControl: Dispatch<SetStateAction<string | undefined>>
  openControl: string | undefined
  name: string
  menuClassName?: string
}

export const ControlsMenu = ({
  className,
  Icon,
  children,
  openControl,
  name,
  setOpenControl,
  menuClassName,
}: EditMenuProps) => {
  const isOpen = openControl === name
  const containerRef = useRef<HTMLDivElement>(null)

  const onClickOutside = (e: globalThis.MouseEvent) => {
    if (!containerRef.current?.contains(e.target as Element)) {
      setOpenControl(undefined)
    }
  }
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", onClickOutside)
    }
    return () => {
      document.removeEventListener("click", onClickOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <div className={classnames(className, "relative")} ref={containerRef}>
      <div
        className={classnames(
          "bg-gray-900/80 rounded-md  my-2 text-white shadow-md",
          "absolute bottom-full transform transition-all",
          !isOpen && "opacity-0 translate-y-1 pointer-events-none",
          isOpen && "opacity-100 translate-y-0",
          menuClassName
        )}
      >
        {children}
      </div>
      <IconButton
        className={classnames("rounded-full p-2 bg-gray-900/80 hover:bg-gray-900/10", isOpen && "!bg-gray-900/10")}
        onClick={() => setOpenControl((v) => (v !== name ? name : undefined))}
        active={isOpen}
      >
        <Icon size={15} color={"white"} />
      </IconButton>
    </div>
  )
}
