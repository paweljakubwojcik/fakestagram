import classnames from "classnames"
import { ComponentPropsWithRef, ComponentType, createElement, ElementType, FC, ForwardedRef, forwardRef } from "react"

type CardProps<T extends ElementType = ElementType> = ComponentPropsWithRef<T> & {
    component?: T | ComponentType
    light?: boolean
}



export const Card: FC<CardProps> = forwardRef(
    ({ className, children, component = "div", light, ...props }, ref: ForwardedRef<ElementType>) => {
        return createElement<CardProps>(
            component,
            {
                className: classnames(
                    "bg-white flex flex-col border rounded m-3 dark:!border-gray-300/20 ",
                    light && "dark:bg-gray-800",
                    !light && "dark:bg-black",
                    className
                ),
                ref,
                ...props,
            },
            children
        )
    }
)

Card.displayName = "Card"
