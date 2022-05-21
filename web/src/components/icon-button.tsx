import classnames from "classnames"
import type { ComponentProps, FC } from "react"
import { Button } from "./button"

type IconButtonProps = ComponentProps<typeof Button>

export const IconButton: FC<IconButtonProps> = ({ className, children, ...props }) => {
  return (
    <Button className={classnames("", className)} {...props} mode="inline">
      <div className="relative">
        <span className="child:instagradient">{children}</span>
        <span className="absolute top-0 left-0 group-hover:opacity-0 transition-opacity">{children}</span>
      </div>
    </Button>
  )
}
