
"use client";

import { Skeleton } from "@nextui-org/skeleton";
import { motion } from "framer-motion";
import NextImage from "next/image";
import { useState } from "react";
import type { Image } from "../types/types";

export function Artist({ name, images }: { name: string, images: Image[] }) {
    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <div className="flex flex-col w-full h-full justify-center items-center">
            <motion.div layoutScroll={true} layout="position" className="flex flex-col justify-center items-center">
                <div className="relative h-28 w-28 md:w-32 md:h-32 lg:w-44 lg:h-44">
                    <Skeleton className="rounded-full h-full w-full absolute top-0 left-0" style={{opacity: imageLoaded? 0: 1}}/>
                    <NextImage onLoad={() => {setImageLoaded(true)}} className="rounded-full" layout="fill" objectFit="cover" unoptimized alt="Album Image" src={images[0].url} />
                </div>
                <p className="truncate text-center w-full">
                    {name}
                </p>
            </motion.div>
        </div>
    )
}