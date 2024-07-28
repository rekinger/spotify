"use client";

import defaultImage from '@/src/public/defaulttrack.png';
import { Skeleton } from "@nextui-org/skeleton";
import { Tooltip } from "@nextui-org/tooltip";
import localFont from 'next/font/local';
import NextImage from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { MdAdd, MdCheck } from "react-icons/md";
import { toast } from 'sonner';
import type { Artist, Image, Ingredient } from "../types/types";

const myFont = localFont({ src: '../public/CircularStd-Black.otf' })

export function SearchTrack({ name, artists, albumImages, id, setIngredients, added}: { name: string, artists: Artist[], albumImages: Image[], id: string, setIngredients:Dispatch<SetStateAction<Ingredient[]>>, added:boolean }) {
    const [imageLoaded, setImageLoaded] = useState(false)

    function addTrack() {
        setIngredients((oldIngredients: Ingredient[]) => {

            if(oldIngredients.length >= 5) {
                toast('Max 5 Ingredients Allowed!')

                return oldIngredients
            }
            const addTrack: Ingredient = {
                image: albumImages.length > 0 ? albumImages[0].url:defaultImage,
                title: name,
                id: id, 
                type: "Track"
            }

            const newIngredients = [...oldIngredients, addTrack]

            return newIngredients
        })
    }

    return (
        <div className="flex track w-full rounded-md py-3 items-center">
            <div className="relative w-14 h-14">
                <Skeleton className="h-14 w-14 absolute top-0 left-0" style={{ opacity: imageLoaded ? 0 : 1 }} />
                <NextImage onLoad={() => { setImageLoaded(true) }} unoptimized alt="Album Image" src={albumImages.length > 0 ? albumImages[0].url:defaultImage} layout="fill" objectFit="cover" />
            </div>
            <div className="flex flex-col ml-2 truncate" style={{ maxWidth: '65%' }}>
                <p className="truncate">
                    {name}
                </p>
                <div className="truncate max-w-full">
                    {
                        artists.map((item, index) => (
                            <span key={index} className="opacity-75">
                                {item.name}{index === artists.length - 1 ? "" : ","}&nbsp;
                            </span>
                        ))
                    }
                </div>
            </div>
            <Tooltip key={id} closeDelay={0} className={`${myFont.className} p-2`} showArrow={true} placement="left" content={added ? "Ingredient Added": "Add Ingredient"}>
                {
                    added ? (
                        <div className="ml-auto">
                            <MdCheck size={30} color="white" />
                        </div>
                    ):
                    (
                        <div onClick={addTrack} className="ml-auto cursor-pointer active:opacity-50">
                            <MdAdd size={30} color="white" />
                        </div>
                    )
                }
            </Tooltip>
        </div>
    )
}
