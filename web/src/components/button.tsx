/* eslint-disable react/display-name */
import classnames from "classnames"
import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from "react"

type ButtonProps = (
  | (ComponentPropsWithoutRef<"button"> & { asLink?: false })
  | (ComponentPropsWithoutRef<"a"> & { asLink: true })
) & {
  mode?: "primary" | "secondary" | "inline" | "default"
  loading?: boolean
  disabled?: boolean
}

const Loader = () => (
  <div className="block w-[1em] h-[1em] rounded-full border-2 border-t-transparent animate-spin mx-2" />
)

export const Button = forwardRef<ForwardedRef<HTMLButtonElement | HTMLAnchorElement | null>, ButtonProps>(
  ({ className, children, mode = "default", loading, disabled, asLink, ...props }, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        disabled={disabled}
        className={classnames(
          "font-semibold text-sm rounded-sm transition-colors flex justify-center items-center group",
          mode === "inline" && "font-normal p-0 inline",
          disabled && "filter grayscale cursor-default pointer-events-none",
          className,
          ["primary", "secondary"].includes(mode) &&
            `relative overflow-visible before:rounded before:bg-insta-gradient before:absolute 
            before:w-full before:h-full`
        )}
      >
        {mode === "inline" ? (
          children
        ) : (
          <div
            className={classnames(
              "p-2 relative w-full h-full m-[1px] text-black block rounded-sm",
              "flex justify-center items-center transition-colors",
              mode !== "primary" && "bg-white group-hover:bg-white/90",
              mode === "primary" && "bg-transparent group-hover:bg-gray-50/20",
              mode === "default" && "group-hover:bg-gray-200/80"
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
        )}
      </button>
    )
  }
)

Button.displayName = "Button"
