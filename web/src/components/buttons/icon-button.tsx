import classnames from "classnames"
import { ComponentProps, FC, forwardRef } from "react"
import { ButtonBase } from "./button-base"

type IconButtonProps = ComponentProps<typeof ButtonBase> & {
  active?: boolean
}

export const IconButton: FC<IconButtonProps> = forwardRef<any, IconButtonProps>(
  ({ className, children, active,  ...props }, ref) => {
    return (
      <ButtonBase className={classnames("group", className)} {...props} ref={ref}>
        <div className="relative">
          <span className="child:instagradient-stroke ">{children}</span>
          <span
            className={classnames(
              active && "opacity-0",
              "absolute top-0 left-0 group-hover:opacity-0 transition-opacity"
            )}
          >
            {children}
          </span>
        </div>
      </ButtonBase>
    )
  }
)

IconButton.displayName = "IconButton"
