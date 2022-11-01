import classnames from "classnames"
import { Button, IconButton } from "components/buttons"
import { ButtonBase } from "components/buttons/button-base"
import { Slider } from "components/slider"
import { pick } from "ramda"
import { ComponentPropsWithoutRef, FC, useRef, useState } from "react"
import { Copy as ImageSwitchIcon, Maximize as AspectRatioChangeIcon, Plus, X, ZoomIn as ScaleIcon } from "react-feather"
import { AspectRatio, CropData, getCurrentImage, usePostState } from "../post-state"
import { ControlsMenu } from "./controls-menu"

type ControlsProps = ComponentPropsWithoutRef<"div"> & {
    applyTranslate: (data: Partial<CropData>) => void
}

const ASPECTS_RATIOS: AspectRatio[] = [
    {
        x: 1,
        y: 1,
    },
    {
        x: 4,
        y: 5,
    },
    {
        x: 16,
        y: 9,
    },
]

export const Controls: FC<ControlsProps> = ({ className, applyTranslate }) => {
    const { setCrop, remove, setAspectRatio, setCurrentImage, append } = usePostState(
        pick(["setCrop", "remove", "setAspectRatio", "setCurrentImage", "append"])
    )
    const currentImage = usePostState(getCurrentImage)
    const { images, aspectRatio } = usePostState(pick(["images", "aspectRatio"]))

    const [openControl, setOpenControl] = useState<string>()

    const fileInputRef = useRef<HTMLInputElement>(null)

    return (
        <div id="controls" className="absolute bottom-0 w-full p-4 flex">
            <ControlsMenu
                Icon={AspectRatioChangeIcon}
                setOpenControl={setOpenControl}
                openControl={openControl}
                name="AspectRatio"
            >
                <div className="">
                    {[
                        { x: currentImage.originalSize.width, y: currentImage.originalSize.height, label: "original" },
                        ...ASPECTS_RATIOS.map(({ x, y }) => ({ x, y, label: `${x}:${y}` })),
                    ].map(({ x, y, label }) => (
                        <Button
                            key={label}
                            className={classnames(
                                "bg-transparent !text-white p-4 w-24 text-right group-hover:!bg-gray-50/20 opacity-60",
                                aspectRatio.x === x && aspectRatio.y === y && "!opacity-100"
                            )}
                            onClick={() => setAspectRatio({ x, y })}
                        >
                            {label}
                        </Button>
                    ))}
                </div>
            </ControlsMenu>
            <ControlsMenu
                Icon={ScaleIcon}
                className="mx-2"
                setOpenControl={setOpenControl}
                openControl={openControl}
                name="Scale"
            >
                <div>
                    <Slider
                        value={currentImage.crop.scale}
                        onChange={(scale) => {
                            applyTranslate({ scale })
                            setCrop({ scale })
                        }}
                        min={1}
                        max={2}
                    />
                </div>
            </ControlsMenu>
            <ControlsMenu
                Icon={ImageSwitchIcon}
                className="ml-auto"
                setOpenControl={setOpenControl}
                openControl={openControl}
                name="ImageSwitch"
                menuClassName="right-0"
            >
                <div className="flex p-2 space-x-2 flex-wrap max-w-[600px]">
                    {Object.entries(images).map(([id, image]) => (
                        <div key={id} className="relative">
                            <IconButton
                                className="absolute right-2 top-2"
                                onClick={(e: any) => {
                                    e.stopPropagation()
                                    remove(id)
                                }}
                            >
                                <X />
                            </IconButton>
                            <ButtonBase onClick={() => setCurrentImage(id)}>
                                <div
                                    className="block w-24 h-24 bg-cover bg-no-repeat bg-center"
                                    style={{
                                        backgroundImage: `url(${image.originalUrl})`,
                                    }}
                                />
                            </ButtonBase>
                        </div>
                    ))}
                    {Boolean(Object.entries(images).length < 5) && (
                        <>
                            <ButtonBase className="w-24 h-24" onClick={() => fileInputRef.current?.click()}>
                                <Plus />
                            </ButtonBase>
                            <input
                                className="hidden"
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => append(Array.from(e.target.files || []))}
                            />
                        </>
                    )}
                </div>
            </ControlsMenu>
        </div>
    )
}
