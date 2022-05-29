import classnames from "classnames"
import type { FC } from "react"

type SliderProps = {
  value: number
  onChange: (value: number) => void
  max: number
  min: number
}

export const Slider: FC<SliderProps> = ({ value, onChange, max, min }) => {
  return (
    <div className={classnames("")}>
      <input
        min="0"
        max="100"
        type="range"
        value={(((value - min) / (max - min))) * 100}
        onChange={(e) => {
          const v = e.target.valueAsNumber
          const actualValue = (v / 100) * (max - min) + min
          onChange(actualValue)
        }}
      />
    </div>
  )
}
