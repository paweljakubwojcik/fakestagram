import classnames from "classnames"
import { ComponentProps, FC, forwardRef } from "react"
import { ButtonBase } from "./button-base"

type IconButtonProps = ComponentProps<typeof ButtonBase>

export const IconButton: FC<IconButtonProps> = forwardRef<any, IconButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ButtonBase className={classnames("", className)} {...props} ref={ref}>
        <div className="relative">
          <span className="child:instagradient-stroke">{children}</span>
          <span className="absolute top-0 left-0 group-hover:opacity-0 transition-opacity">{children}</span>
        </div>
      </ButtonBase>
    )
  }
)

IconButton.displayName = "IconButton"
