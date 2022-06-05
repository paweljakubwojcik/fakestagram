import type { FC, ComponentPropsWithoutRef } from "react"

type LayoutProps = ComponentPropsWithoutRef<"div">

export const Layout: FC<LayoutProps> = ({ children }) => {
  return <div className="min-h-screen w-full  text-xs  dark:text-white">{children}</div>
}
