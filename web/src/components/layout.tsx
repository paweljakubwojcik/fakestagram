import type { FC, ComponentPropsWithoutRef } from "react"
import classnames from "classnames"
import { Navbar } from "./navbar"

type LayoutProps = ComponentPropsWithoutRef<"div">

export const Layout: FC<LayoutProps> = ({ children }) => {
  return <div className="h-screen w-full  text-xs bg-gray-50 dark:bg-gray-900 dark:text-white">{children}</div>
}
