
"use client";

import { Skeleton } from "@nextui-org/skeleton";
import { motion } from "framer-motion";
import NextImage from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Image } from "../types/types";

export function Artist({ name, images, href }: { name: string, images: Image[], href: string }) {
    const [imageLoaded, setImageLoaded] = useState(false)
 
    return (
            <motion.div layout="position" transition={{duration:0.5}} className="w-full h-full flex flex-col justify-center items-center">
                <Link className="h-full w-full flex items-center justify-center flex-col" href={href} target="_blank">
                    <div className="relative w-full aspect-square">
                        <Skeleton className=" h-full w-full absolute top-0 left-0" style={{opacity: imageLoaded? 0: 1}}/>
                        <NextImage onLoad={() => {setImageLoaded(true)}} layout="fill" objectFit="cover" unoptimized alt="Album Image" src={images.length > 0 ? images[0].url:""} />
                    </div>
                    <p className="truncate text-center max-w-full">
                        {name}
                    </p>
                </Link>
            </motion.div>
    )
}