export type AspectRatio = {
  x: number
  y: number
}

export type CropData = {
  x: number
  y: number
  scale: number
}

export type EditableImage = {
  base64url: string
  crop: CropData
  aspectRatio: AspectRatio
  originalAspectRatio: AspectRatio
}
