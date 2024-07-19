
  "use client";

import { Skeleton } from "@nextui-org/skeleton";
import localFont from 'next/font/local';
import NextImage from "next/image";
import { useState } from "react";
import type { Artist, Image } from "../types/types";

const myFont = localFont({src: "../public/CircularStd-Black.otf"})

function getDuration(ms: number): string {
    const date = new Date(ms);

    let seconds = date.getSeconds().toString()

    if(parseInt(seconds) < 10) {
        seconds = "0" + seconds
    }
    return `${date.getMinutes()}:${seconds}`
}

export function Track({ name, ms, artists, albumImages }: { name: string, ms: number, artists: Artist[], albumImages: Image[]}) {
    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <div className="flex track w-full rounded-md py-3 items-center">
            <div className="relative w-14 h-14">
                <Skeleton className="h-14 w-14 absolute top-0 left-0" style={{opacity: imageLoaded? 0: 1}}/>
                <NextImage onLoad={() => {setImageLoaded(true)}}  unoptimized alt="Album Image" src={albumImages[0].url} height={56} width={56}/>
            </div>
            <div className="flex flex-col ml-2">
                <p className="truncate">
                    {
                        name
                    }
                </p>
                <div className="flex flex-row">
                    {
                        artists.map((item, index) => {
                            return (
                                <p className="opacity-75 truncate">
                                    {item.name}{index == artists.length - 1 ? "":","}&nbsp;
                                </p>
                            )
                        })
                    }
                </div>
            </div>
            <div className="ml-auto opacity-75">
                {
                    getDuration(ms)
                }
            </div>
        </div>
    )
}