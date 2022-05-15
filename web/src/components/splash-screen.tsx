import type { FC, ComponentPropsWithoutRef } from "react"
import classnames from "classnames"

type SplashScreenProps = ComponentPropsWithoutRef<"div">

export const SplashScreen: FC<SplashScreenProps> = ({ className }) => {
  return <div className={classnames("", className)}>Loading...</div>
}
