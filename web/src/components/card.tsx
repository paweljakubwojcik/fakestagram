import { FC, ComponentPropsWithoutRef, ElementType, ComponentType, createElement } from "react"
import classnames from "classnames"

type CardProps = ComponentPropsWithoutRef<"div"> & {
  component?: ElementType | ComponentType
}

export const Card: FC<CardProps> = ({ className, children, component = "div", ...props }) => {
  return createElement<CardProps>(
    component,
    { className: classnames("bg-white flex flex-col p-8 border rounded-sm m-3", className), ...props },
    children
  )
}
