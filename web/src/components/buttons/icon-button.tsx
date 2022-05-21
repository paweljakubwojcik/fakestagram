import classnames from "classnames"
import type { ComponentProps, FC } from "react"
import { ButtonBase } from "./button-base"

type IconButtonProps = ComponentProps<typeof ButtonBase>

export const IconButton: FC<IconButtonProps> = ({ className, children, ...props }) => {
  return (
    <ButtonBase className={classnames("", className)} {...props}>
      <div className="relative">
        <span className="child:instagradient">{children}</span>
        <span className="absolute top-0 left-0 group-hover:opacity-0 transition-opacity">{children}</span>
      </div>
    </ButtonBase>
  )
}
