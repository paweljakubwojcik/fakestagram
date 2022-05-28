/* eslint-disable react/display-name */
import classnames from "classnames"
import { ComponentProps, ComponentPropsWithoutRef, ForwardedRef, forwardRef } from "react"
import { ButtonBase } from "./button-base"

type ButtonProps = ComponentProps<typeof ButtonBase> & {
  mode?: "primary" | "secondary" | "default"
  loading?: boolean
  baseClassName?: string
}

const Loader = () => (
  <div className="block w-[1em] h-[1em] rounded-full border-2 border-t-transparent animate-spin mx-2" />
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, baseClassName, children, mode = "default", loading, ...props }, ref) => {
    return (
      <ButtonBase
        {...props}
        ref={ref}
        className={classnames(
          baseClassName,
          mode !== "default" && `relative overflow-visible before:rounded before:bg-insta-gradient before:absolute before:w-full before:h-full`,
          mode === "secondary" && "before:transition-opacity before:opacity-0 before:hover:opacity-100"
        )}
      >
        <div
          className={classnames(
            "p-2 relative w-full h-full m-[1px] text-black block rounded-sm text-inherit",
            "flex justify-center items-center transition-colors",
            mode !== "primary" && "group-hover:bg-white/90 dark:group-hover:bg-gray-700/80",
            mode === "primary" && "bg-transparent group-hover:bg-gray-50/20",
            mode === "default" && "group-hover:bg-gray-200/80",
            className,
          )}
        >
          <span>{loading && <Loader />}</span>
          <span
            className={classnames(
              mode === "secondary" && "bg-insta-gradient bg-clip-text text-transparent",
              mode === "primary" && "text-white"
            )}
          >
            {children}
          </span>
        </div>
      </ButtonBase>
    )
  }
)

Button.displayName = "Button"
