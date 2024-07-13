
  "use client";

import { Skeleton } from "@nextui-org/skeleton";
import NextImage from "next/image";
import { useState } from "react";
import type { Artist, Image } from "../types/types";

function getDuration(ms: number): string {
    const date = new Date(ms);

    let seconds = date.getSeconds().toString()

    if(parseInt(seconds) < 10) {
        seconds = "0" + seconds
    }
    return `${date.getMinutes()}:${seconds}`
}

export function Track({ name, ms, artists, albumImages }: { name: string, ms: number, artists: Artist[], albumImages: Image[] }) {
    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <div className="flex w-full py-2">
            <div className="relative w-12 h-12 rounded-md">
                <Skeleton className="rounded-md h-12 w-12 absolute top-0 left-0" style={{opacity: imageLoaded? 0: 1}}/>
                <NextImage onLoad={() => {setImageLoaded(true)}} className="rounded-md" unoptimized alt="Album Image" src={albumImages[0].url} height={48} width={48}/>
            </div>
            <div className="flex flex-col ml-2">
                <p>
                    {
                        name
                    }
                </p>
                <div className="flex flex-row">
                    {
                        artists.map((item, index) => {
                            return (
                                <p className="opacity-75">
                                    {item.name}{index == artists.length - 1 ? " ":", "}
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