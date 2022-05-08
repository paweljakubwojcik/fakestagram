import { FC, ComponentPropsWithoutRef, forwardRef, ForwardedRef } from "react"
import classnames from "classnames"

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  mode?: "primary" | "secondary" | "inline"
  loading?: boolean
  disabled?: boolean
}

const Loader = () => (
  <div className="block w-[1em] h-[1em] rounded-full border-2 border-white border-t-transparent animate-spin mx-2" />
)

export const Button = forwardRef(
  (
    { className, children, type = "button", mode = "primary", loading, disabled, ...props }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement | null>
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        disabled={disabled}
        type={type}
        className={classnames(
          "font-semibold p-2 text-sm rounded-sm transition-colors flex justify-center items-center",
          mode === "primary" && "bg-primary text-white hover:bg-primary-light",
          mode === "secondary" && "bg-white text-primary border hover:bg-gray-50 hover:text-primary-light",
          mode === "inline" && "font-normal p-0 hover:text-primary-light inline",
          disabled && "filter grayscale cursor-default pointer-events-none",
          className
        )}
      >
        {loading && <Loader />}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"
