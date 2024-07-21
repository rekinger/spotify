"use client";

import defaultImage from '@/src/public/default.png';
import { Skeleton } from "@nextui-org/skeleton";
import { Tooltip } from "@nextui-org/tooltip";
import localFont from 'next/font/local';
import NextImage from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { MdAdd } from "react-icons/md";
import type { Artist, Track } from "../types/types";

const myFont = localFont({ src: '../public/CircularStd-Black.otf' })

export function SearchArtist({ artist, setIngredients }: { artist: Artist, setIngredients: Dispatch<SetStateAction<{artists: Artist[]; tracks: Track[]; genres: string[];}>> }) {
    const [imageLoaded, setImageLoaded] = useState(false)

    function addIngredient() {
        setIngredients((oldIngredients) => {
            const newIngredients: {artists: Artist[], tracks: Track[], genres:string[]} = {artists: [...oldIngredients.artists, artist], genres: oldIngredients.genres, tracks: oldIngredients.tracks}

            return newIngredients
        })
    }

    return (
        <div className="flex track w-full rounded-md py-3 items-center">
            <div className="relative w-14 h-14">
                <Skeleton className="h-14 w-14 absolute top-0 left-0" style={{ opacity: imageLoaded ? 0 : 1 }} />
                <NextImage onLoad={() => { setImageLoaded(true) }} unoptimized alt="Album Image" layout="fill" objectFit="cover" src={artist.images.length > 0 ? artist.images[0].url:defaultImage} />
            </div>
            <div className="flex flex-col ml-2 truncate" style={{ maxWidth: '65%' }}>
                <p className="truncate">
                    {artist.name}
                </p>
                <div className="truncate max-w-full">
                    {
                        artist.genres.map((item, index) => (
                            <span key={index} className="opacity-75">
                                {item}{index === artist.genres.length - 1 ? "" : ","}&nbsp;
                            </span>
                        ))
                    }
                </div>
            </div>
            <Tooltip key={artist.id} closeDelay={0} className={`${myFont.className} p-2`} showArrow={true} placement="left" content={"Add Ingredient"}>
                <div className="ml-auto cursor-pointer active:opacity-50" onClick={addIngredient}>
                    <MdAdd size={30} color="white" />
                </div>
            </Tooltip>
        </div>
    )
}