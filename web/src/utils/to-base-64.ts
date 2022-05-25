export const toBase64 = async (file: File) => {
  const reader = new FileReader()
  return new Promise<string>((res, rej) => {
    reader.addEventListener("load", () => {
      const result = reader.result as string | null
      if (result) {
        res(result)
      } else {
        rej("result is null")
      }
    })
    reader.addEventListener("error", () => {
      rej("Error during converting file to base64 string")
    })
    reader.readAsDataURL(file)
  })
}
