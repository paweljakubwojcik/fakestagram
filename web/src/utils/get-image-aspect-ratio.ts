export const getImageAspectRatio = (url: string) => {
  const image = document.createElement("img")
  image.src = url

  return new Promise<{ x: number; y: number }>((res, rej) => {
    image.addEventListener("load", () => {
      res({ x: image.width, y: image.height })
    })
    image.addEventListener("error", () => {
      rej("Cannot read dimensions of an image")
    })
  })
}
