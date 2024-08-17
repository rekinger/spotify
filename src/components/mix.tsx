
"use client";

import defaultUserImage from '@/src/public/default.png';
import { Skeleton } from "@nextui-org/skeleton";
import { Tooltip } from "@nextui-org/tooltip";
import { Mix as MixType } from "@prisma/client";
import { motion } from "framer-motion";
import localFont from 'next/font/local';
import { default as Image, default as NextImage } from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaCalendar } from 'react-icons/fa';
import { MdPublic, MdPublicOff } from "react-icons/md";

const myFont = localFont({ src: '../public/CircularStd-Black.otf' })

export function Mix({ mix }: { mix: MixType }) {
    const [imageLoaded, setImageLoaded] = useState(false)
 
    return (
            <motion.div layout="position" transition={{duration:0.5}} className="w-full h-full flex flex-col justify-center items-center">
                <Tooltip className={myFont.className} color="success" classNames={{ content:"text-black"}} showArrow={true} content={mix.title.length ? mix.title: "No Title"}>
                    <Link href={mix.url} target="_blank" className="truncate hover:underline text-2xl p-0 m-0 max-w-full self-start">
                        {mix.title.length ? mix.title: "No Title"}
                    </Link>
                </Tooltip>
                <Link className="w-full aspect-square" href={mix.url} target="_blank">
                    <div className="w-full h-full relative">
                        <Skeleton className=" h-full w-full absolute top-0 left-0" style={{opacity: imageLoaded? 0: 1}}/>
                        <NextImage onLoad={() => {setImageLoaded(true)}} layout="fill" objectFit="cover" unoptimized alt="Album Image" src={mix.spotifyPlaylistImage != "" ? mix.spotifyPlaylistImage: defaultUserImage} />
                    </div>
                </Link>
                <div className="flex w-full items-start flex-row justify-between py-1 px-1">
                    <div className="flex flex-col flex-1 items-start overflow-x-hidden max-w-full">
                        {
                            mix.public ? (
                                <div className="flex justify-center items-center gap-x-[2px]">
                                    <MdPublic size={14} color="rgb(29, 185, 84)" />
                                    <p className="text-sm text-[#1DB954]" >
                                        Public 
                                    </p>
                                </div>
                            ):
                            (
                                <div className="flex justify-center items-center gap-x-[2px]">
                                    <MdPublicOff size={14} color="#d43439" />
                                    <p className="text-sm text-[#d43439]" >
                                        Private
                                    </p>
                                </div>
                            )
                        }
                        <div className="flex justify-center items-center gap-x-[2px]">
                            <FaCalendar  size={14} color="white" className="opacity-65"/>
                            <p className="text-xs opacity-60">
                                {
                                    mix.createdAt.toLocaleDateString()
                                }
                            </p>
                        </div>
                    </div>
                    <Link href={mix.spotifyUserUrl} target="_blank" className="flex flex-1 flex-col gap-x-1 items-end justify-end hover:underline truncate max-w-full">
                        <div className="flex w-full justify-end">
                            <Tooltip placement='bottom' className={myFont.className} color="success" classNames={{ content:"text-black"}} showArrow={true} content={mix.username}>
                                <div className="flex relative h-9 w-9 rounded-full">
                                    <Image className="rounded-full" unoptimized layout='fill' objectFit="cover" alt="Profile Picture" src={mix.spotifyUserImage != "" ? mix.spotifyUserImage: defaultUserImage} />
                                </div>
                            </Tooltip>
                        </div>
                    </Link>
                </div>
            </motion.div>
    )
}