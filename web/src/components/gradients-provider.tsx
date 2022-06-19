import type { FC } from "react"

/**
 * Component that provides svg gradients trough an application, needs to be anywhere in the component tree
 */
export const GradientsProvider: FC = () => {
  return (
    <svg width="0" height="0">
      <linearGradient id="blue-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop stopColor="#6dd5ed" offset="0%" />
        <stop stopColor="#2193b0" offset="100%" />
      </linearGradient>
      <linearGradient id="insta-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop stopColor="#6559ca" offset="0%" />
        <stop stopColor="#bc318f" offset="30%" />
        <stop stopColor="#e33f5f" offset="50%" />
        <stop stopColor="#f77638" offset="70%" />
        <stop stopColor="#fec66d" offset="100%" />
      </linearGradient>
      <linearGradient id="brand-gradient">
        <stop offset="0%" stopColor="#F8ED34" />
        <stop offset="50%" stopColor="#EA118D" />
        <stop offset="100%" stopColor="#2E368F" />
      </linearGradient>
    </svg>
  )
}
