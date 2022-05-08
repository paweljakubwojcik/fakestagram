import classnames from "classnames"
import { ComponentPropsWithRef, ComponentType, createElement, ElementType, FC, ForwardedRef, forwardRef } from "react"

type CardProps<T extends ElementType = ElementType> = ComponentPropsWithRef<T> & {
  component?: T | ComponentType
}

export const Card: FC<CardProps> = forwardRef(
  ({ className, children, component = "div", ...props }, ref: ForwardedRef<ElementType>) => {
    return createElement<CardProps>(
      component,
      { className: classnames("bg-white flex flex-col border rounded-sm m-3", className), ref, ...props },
      children
    )
  }
)

Card.displayName = "Card"
