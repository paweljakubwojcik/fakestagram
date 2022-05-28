import classnames from "classnames"
import { ComponentPropsWithRef, createElement, FC, forwardRef } from "react"

type PossibleHtmlElements = HTMLButtonElement | HTMLAnchorElement

type ButtonBaseProps =
  | (ComponentPropsWithRef<"a"> & {
      renderAs?: "a"
      disabled?: boolean
      type?: "button" | "submit" | "reset"
    })
  | (ComponentPropsWithRef<"button"> & {
      renderAs?: "button"
      type?: "button" | "submit" | "reset"
    })

export const ButtonBase = forwardRef<PossibleHtmlElements, ButtonBaseProps>(
  ({ className, children, renderAs = "button", disabled, type = "button", ...props }, ref) => {
    return createElement<ButtonBaseProps>(
      renderAs,
      {
        className: classnames(
          "font-semibold text-sm rounded-sm transition-colors flex justify-center items-center group h-fit",
          disabled && "filter grayscale cursor-default pointer-events-none",
          className
        ),
        type,
        ref: ref as any,
        ...props,
      },
      children
    )
  }
)

ButtonBase.displayName = "ButtonBase"
