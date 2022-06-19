type Size = { width: number; height: number }

export const getImageSize = (url: string) => {
  const image = document.createElement("img")
  image.src = url

  return new Promise<Size>((res, rej) => {
    image.addEventListener("load", () => {
      res({ width: image.width, height: image.height })
    })
    image.addEventListener("error", () => {
      rej("Cannot read dimensions of an image")
    })
  })
}
