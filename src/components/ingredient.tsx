"use client";

import defaultImage from '@/src/public/default.png';
import { Skeleton } from "@nextui-org/skeleton";
import { Tooltip } from "@nextui-org/tooltip";
import { motion } from 'framer-motion';
import localFont from 'next/font/local';
import NextImage from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { MdRemove } from "react-icons/md";
import type { Ingredient as IngredientType } from "../types/types";

const myFont = localFont({ src: '../public/CircularStd-Black.otf' })

export function Ingredient({ ingredient, setIngredients, index }: { ingredient: IngredientType, setIngredients: Dispatch<SetStateAction<IngredientType[]>>, index:number }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    function removeIngredient() {
        setIngredients((oldIngredients: IngredientType[]) => {
            const newIngredients = [...oldIngredients];
            newIngredients.splice(index, 1);

            return newIngredients;
        });
    }

    return (
        <motion.div layout="position" exit={{ translateY:"-100%", opacity:0 }} className="flex w-full rounded-md py-3 items-center overflow-hidden flex-shrink-0">
            <div className="relative w-14 h-14 flex-shrink-0">
                <Skeleton className="h-14 w-14 absolute top-0 left-0" style={{ opacity: imageLoaded ? 0 : 1 }} />
                <NextImage onLoad={() => { setImageLoaded(true) }} unoptimized alt="Album Image" src={typeof ingredient.image == "string" && ingredient.image.length > 0 ? ingredient.image : defaultImage} layout="fill" objectFit="cover" />
            </div>
            <div className="flex flex-col ml-2 truncate" style={{ maxWidth: '65%' }}>
                <p className="truncate">
                    {ingredient.title}
                </p>
                <div className="truncate max-w-full opacity-65">
                    {ingredient.type}
                </div>
            </div>
            <Tooltip key={ingredient.id} closeDelay={0} className={`${myFont.className} p-2`} showArrow={true} placement="left" content={"Remove Ingredient"}>
                <div onClick={removeIngredient} className="ml-auto cursor-pointer active:opacity-50">
                    <MdRemove size={30} color="white" />
                </div>
            </Tooltip>
        </motion.div>
    );
}