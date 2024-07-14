
  "use client";

import { Skeleton } from "@nextui-org/skeleton";
import { Tooltip } from "@nextui-org/tooltip";
import { motion } from "framer-motion";
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

export function Track({ name, ms, artists, albumImages, lastPlayed }: { name: string, ms: number, artists: Artist[], albumImages: Image[], lastPlayed: string }) {
    const [imageLoaded, setImageLoaded] = useState(false)

    const timeObj = new Date(lastPlayed);
    const readableTime = timeObj.toLocaleString('en-US', {year:'numeric', month:'long', day:'2-digit', hour:'numeric', minute:'numeric'});

    return (
        <Tooltip className={myFont.className + " p-2 bg-black"} showArrow={true} content={readableTime}>
            <motion.div initial={{opacity:0, marginTop:8}} animate={{opacity:1, marginTop:0}} className="flex track w-full rounded-md p-3 items-center">
                <div className="relative w-14 h-14 rounded-md">
                    <Skeleton className="rounded-md h-14 w-14 absolute top-0 left-0" style={{opacity: imageLoaded? 0: 1}}/>
                    <NextImage onLoad={() => {setImageLoaded(true)}} className="rounded-md" unoptimized alt="Album Image" src={albumImages[0].url} height={56} width={56}/>
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
            </motion.div>
        </Tooltip>
    )
}