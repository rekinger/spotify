
"use client";

import { Button } from "@nextui-org/button";
import { Skeleton } from "@nextui-org/skeleton";
import { motion } from "framer-motion";
import NextImage from "next/image";
import Link from 'next/link';
import { useState } from "react";
import type { Image } from "../types/types";

export function Artist({ name, images, id }: { name: string, images: Image[], id: string }) {
    const [imageLoaded, setImageLoaded] = useState(false)
 
    return (
        <Link href={`/artists/${id}`} className="artist flex flex-col w-full h-full justify-center items-center">
            <motion.div layout="position" transition={{duration:0.5}} className="flex flex-col justify-center items-center">
                <Button className=" p-0 h-28 w-28 md:w-32 md:h-32 lg:w-44 lg:h-44 rounded-none">
                    <div className="relative h-28 w-28 md:w-32 md:h-32 lg:w-44 lg:h-44">
                        <Skeleton className=" h-full w-full absolute top-0 left-0" style={{opacity: imageLoaded? 0: 1}}/>
                        <NextImage onLoad={() => {setImageLoaded(true)}} layout="fill" objectFit="cover" unoptimized alt="Album Image" src={images.length > 0 ? images[0].url:""} />
                    </div>
                </Button>
                <p className="truncate text-center max-w-full">
                    {name}
                </p>
            </motion.div>
        </Link>
    )
}