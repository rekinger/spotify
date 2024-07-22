"use client";

import defaultImage from '@/src/public/default.png';
import { Skeleton } from "@nextui-org/skeleton";
import { Tooltip } from "@nextui-org/tooltip";
import localFont from 'next/font/local';
import NextImage from "next/image";
import { useState } from "react";
import { MdAdd } from "react-icons/md";
import type { Image } from "../types/types";

const myFont = localFont({ src: '../public/CircularStd-Black.otf' })

export function SearchArtist({ name, images, id, genres }: { name: string, images: Image[], id: string, genres: string[] }) {
    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <div className="flex track w-full rounded-md py-3 items-center">
            <div className="relative w-14 h-14">
                <Skeleton className="h-14 w-14 absolute top-0 left-0" style={{ opacity: imageLoaded ? 0 : 1 }} />
                <NextImage onLoad={() => { setImageLoaded(true) }} unoptimized alt="Album Image" src={images.length > 0 ? images[0].url:defaultImage} layout="fill" objectFit="cover" />
            </div>
            <div className="flex flex-col ml-2 truncate" style={{ maxWidth: '65%' }}>
                <p className="truncate">
                    {name}
                </p>
                <div className="truncate max-w-full">
                    {
                        genres.map((item, index) => (
                            <span key={index} className="opacity-75">
                                {item}{index === genres.length - 1 ? "" : ","}&nbsp;
                            </span>
                        ))
                    }
                </div>
            </div>
            <Tooltip key={id} closeDelay={0} className={`${myFont.className} p-2`} showArrow={true} placement="left" content={"Add Ingredient"}>
                <div className="ml-auto cursor-pointer active:opacity-50">
                    <MdAdd size={30} color="white" />
                </div>
            </Tooltip>
        </div>
    )
}