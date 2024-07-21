'use client'

import { api } from '@/src/trpc/react';
import type { Artist, Track } from "@/src/types/types";
import { Input } from "@nextui-org/input";
import { Tab, Tabs } from '@nextui-org/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useDebouncedCallback } from 'use-debounce';

export default function Mixer() {
    const [ingredients, _setIngredients] = useState<(Artist | Track | string)[]>([])
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
    const searchMutation = api.me.search.useMutation()

    const debouncedSearch = useDebouncedCallback (
        async (value: string) => {
            value = value.replace(/^\s+/, '');
            if(value.length < 3) {
                console.log('not going to search')
                setPopoverOpen(false)
                return
            }
            else {
                console.log(value)
                setPopoverOpen(true)
                //await searchMutation.mutateAsync({search:value})
            }
        },
        750
      );

    return (
        <div className="flex flex-1 relative w-11/12 sm:w-5/6 px-2 sm:px-6 flex-col page-body py-8 gap-y-4">
            <div className="relative flex flex-row">
                <AnimatePresence>
                    {
                        popoverOpen ? (
                                <motion.div initial={{ opacity: 0, top: 52 }} animate={{ opacity: 1, top: 44}} exit={{opacity:0, top:52}} transition={{duration:0.15}} className="absolute flex flex-col items-center justify-center w-full h-auto max-h-64 overflow-scroll overflow-x-hidden rounded-sm top-11 left-0 py-2 z-10 bg-[#191919]">
                                    <div className="flex w-full justify-end">
                                        <div className="p-1 cursor-pointer hover:opacity-65 active:opacity-40">
                                            <IoClose onClick={() => {setPopoverOpen(false)}} color='white' size={20} />
                                        </div>
                                    </div>
                                    <Tabs variant={'underlined'} aria-label="Tabs">
                                        <Tab key="artists" title="Artists">
                                            <p>
                                                Some artists
                                            </p>
                                        </Tab>
                                        <Tab key="tracks" title="Tracks">
                                            <p>
                                                Some tracks
                                            </p>
                                        </Tab>
                                        <Tab key="genres" title="Genres">
                                            <p>
                                                Some genres
                                            </p>
                                        </Tab>
                                    </Tabs>
                                </motion.div>
                        ):
                        null
                    }
                </AnimatePresence>
                <Input onChange={(e) => debouncedSearch(e.target.value)} spellCheck={false} classNames={{
                    inputWrapper: ["bg-[#191919] hover:!bg-[#202020] focus-within:!bg-[#191919]"], input: "text-md"
                    }} startContent={<FaSearch color={'rgb(29, 185, 84)'} size={15}/>} variant="flat" placeholder="Search Artists, Tracks, Genres" />
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