'use client'

import type { Artist, Track } from "@/src/types/types";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDebouncedCallback } from 'use-debounce';

export default function Mixer() {
    const [ingredients, setIngredients] = useState<(Artist | Track | string)[]>([])
    const [userSearch, setUserSearch] = useState<string>("")

    const debouncedSearch = useDebouncedCallback(
        (value: string) => {
            value = value.replace(/^\s+/, '');
            if(value.length < 3) {
                console.log('not going to search')
                return
            }
            else {
                console.log(value)
            }
        },
        500
      );

    return (
        <div className="flex flex-1 relative w-11/12 sm:w-5/6 px-2 sm:px-6 flex-col page-body py-8 gap-y-4">
            <div className="flex flex-row">
                <Input onChange={(e) => debouncedSearch(e.target.value)} startContent={<FaSearch color={'rgb(29, 185, 84)'} size={15}/>} variant="flat" placeholder="Search Artists, Tracks, Genres" />
            </div>
            <div>
                <p className="p-0 m-0 text-xl">
                    Ingredients
                </p>
            </div>
            <div className="flex flex-col justify-center items-center px-2 py-2 min-h-20">
                {
                    ingredients.length === 0 ? (
                        <p className="opacity-65">
                            No Ingredients Added
                        </p>
                    ):
                    (
                        <div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}