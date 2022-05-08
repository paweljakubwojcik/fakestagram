import { FC, ComponentPropsWithoutRef, useState, ReactNode } from "react"
import classnames from "classnames"
import { ArrowContainer, ArrowContainerProps, Popover, useArrowContainer } from "react-tiny-popover"
import { Button } from "./button"

type PopoverMenuProps = ComponentPropsWithoutRef<"div"> & {
  content: ReactNode
}

const CustomArrowContainer = ({ children, arrowSize, ...props }: ArrowContainerProps) => {
  const {
    arrowContainerStyle,
    arrowStyle: { top, left },
  } = useArrowContainer({
    arrowSize,
    ...props,
  })

  return (
    <div style={arrowContainerStyle}>
      <div className="bg-white  shadow-insta">
        <div
          style={{ top, left, width: arrowSize * 2, height: arrowSize * 2 }}
          className={`block bg-white absolute rotate-45  shadow-insta `}
        />
        <div className="bg-white relative">{children}</div>
      </div>
    </div>
  )
}

export const PopoverMenu: FC<PopoverMenuProps> = ({ className, children, content }) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <Popover
      isOpen={isOpen}
      positions={["bottom"]}
      onClickOutside={() => setOpen(false)}
      content={({ position, childRect, popoverRect }) => (
        <CustomArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor={"white"}
          arrowClassName="shadow-md"
          arrowSize={8}
        >
          {<>{content}</>}
        </CustomArrowContainer>
      )}
    >
      <Button mode="inline" onClick={() => setOpen((v) => !v)}>
        {children}
      </Button>
    </Popover>
  )
}
