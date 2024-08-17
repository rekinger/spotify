import defaultUserImage from '@/src/public/default.png';
import { Skeleton } from "@nextui-org/skeleton";
import { Mix } from '@prisma/client';
import { motion } from 'framer-motion';
import NextImage from "next/image";
import Link from 'next/link';
import { useState } from "react";

export function MixCompact({ mix }: { mix: Mix }) {
    const [imageLoaded, setImageLoaded] = useState(false)

    return (
        <motion.div transition={{duration:0.5}} layout="position" className="flex track w-full rounded-md py-3 items-center">
            <div className="relative w-14 h-14">
                <Skeleton className="h-14 w-14 absolute top-0 left-0" style={{ opacity: imageLoaded ? 0 : 1 }} />
                <NextImage onLoad={() => setImageLoaded(true)} unoptimized alt="Album Image" src={mix.spotifyPlaylistImage != "" ? mix.spotifyPlaylistImage: defaultUserImage} height={56} width={56} />
            </div>
            <div className="flex flex-col ml-2 truncate max-w-[calc(100%-56px-32px-75px)]">
                <Link href={mix.url} target="_blank" className="truncate hover:underline">{mix.title.length ? mix.title: "No Title"}</Link>
                <div className="flex flex-row items-start w-full overflow-x-auto no-scroll opacity-65">
                    {
                        mix.username
                    }
                </div>
            </div>
            <div className="flex items-center gap-x-6 ml-auto pl-2 opacity-65">
                {
                    mix.createdAt.toLocaleDateString()
                }
            </div>
        </motion.div>
    )
}