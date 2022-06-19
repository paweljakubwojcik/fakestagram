import classnames from "classnames"
import { FieldConfig, useField } from "formik"
import { ComponentPropsWithoutRef, memo } from "react"

type InputProps<T> = Pick<FieldConfig<T>, "name" | "validate" | "value"> &
  ComponentPropsWithoutRef<"input"> & { label?: string }

export const InputField = memo(<T,>({ className, name, validate, label, ...props }: InputProps<T>) => {
  const [{ value, ...field }, { error, touched }] = useField({
    name,
    validate,
  })

  const showError = Boolean(error && touched)

  return (
    <div className="w-full">
      <div className="relative w-full flex items-center mt-2">
        <label
          htmlFor={name}
          className={classnames(
            "absolute text-gray-400 px-1 ml-1 pointer-events-none transform origin-top-left transition-all",
            value && "-translate-y-[150%] -translate-x-2 scale-90 bg-inherit"
          )}
        >
          {label}
        </label>
        <input
          {...props}
          {...field}
          value={value || ""}
          className={classnames(
            "border rounded-sm p-2 bg-gray-50/10  w-full focus:outline-none transition-colors autofill:border-primary autofill:bg-transparent",
            value && "bg-white",
            showError && "border-red-600 bg-rose-50",
            className
          )}
        />
      </div>
      <div className="transition-all empty:h-0 h-fit empty:opacity-0 opacity-100 my-1 !error-text ">
        {showError && error}
      </div>
    </div>
  )
})

InputField.displayName = "memoInputField"
