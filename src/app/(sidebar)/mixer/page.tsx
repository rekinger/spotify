'use client'

import { SearchArtist } from '@/src/components/searchartist';
import { SearchTrack } from '@/src/components/searchtrack';
import { api } from '@/src/trpc/react';
import type { Artist, Track } from "@/src/types/types";
import { Input } from "@nextui-org/input";
import { Tab, Tabs } from '@nextui-org/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdExpandMore } from "react-icons/md";
import { ScaleLoader } from 'react-spinners';
import { useDebouncedCallback } from 'use-debounce';

export default function Mixer() {
    const [ingredients, setIngredients] = useState<{artists: Artist[], tracks: Track[], genres:string[]}>({artists:[], tracks:[], genres:[]})
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
    const searchMutation = api.me.search.useMutation()

    const debouncedSearch = useDebouncedCallback (
        (value: string) => {
            value = value.replace(/^\s+/, '');
            if(value.length < 3) {
                searchMutation.reset()
            }
            else {
                setPopoverOpen(true)
                searchMutation.mutate({search:value})
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
                                <motion.div initial={{ opacity: 0, top: 52 }} animate={{ opacity: 1, top: 44,}} exit={{opacity:0, top:52}} transition={{duration:0.15}} className="absolute flex flex-col items-center justify-start w-full h-auto max-h-[70dvh] overflow-x-hidden rounded-md top-11 left-0 px-4 z-10 pt-2 bg-[#191919]">
                                    <Tabs variant={'underlined'} aria-label="Tabs">
                                        <Tab key="artists" title="Artists" className="flex flex-col w-full items-center justify-start overflow-scroll overflow-x-hidden">
                                            {
                                                searchMutation.isPending ? (
                                                    <ScaleLoader
                                                        color={"rgb(29, 185, 84)"}
                                                        loading={true}
                                                        aria-label="Loading Spinner"
                                                    />
                                                ):
                                                !searchMutation.data?.artists.length ? (
                                                    <p className="opacity-65">
                                                        No Artists Found - Ensure Search is 3+ Characters
                                                    </p>
                                                ):
                                                searchMutation.data?.artists.map((item, _index) => {
                                                    return (
                                                        <SearchArtist key={item.id} artist={item} setIngredients={setIngredients}/>
                                                    )
                                                })
                                            }
                                        </Tab>
                                        <Tab key="tracks" title="Tracks" className="flex flex-col w-full items-center justify-start overflow-scroll overflow-x-hidden">
                                        {
                                                searchMutation.isPending ? (
                                                    <ScaleLoader
                                                        color={"rgb(29, 185, 84)"}
                                                        loading={true}
                                                        aria-label="Loading Spinner"
                                                    />
                                                ):
                                                !searchMutation.data?.tracks.length ? (
                                                    <p className="opacity-65">
                                                        No Tracks Found - Ensure Search is 3+ Characters
                                                    </p>
                                                ):
                                                searchMutation.data?.tracks.map((item, _index) => {
                                                    return (
                                                        <SearchTrack key={item.id} track={item} setIngredients={setIngredients}/>
                                                    )
                                                })
                                            }
                                        </Tab>
                                        <Tab key="genres" title="Genres" className="w-full items-center text-center">
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
                    inputWrapper: ["bg-[#191919] hover:!bg-[#202020] focus-within:!bg-[#191919] rounded-md"], input: "text-md"
                    }} startContent={<FaSearch color={'rgb(29, 185, 84)'} size={15}/>} endContent={<div className="cursor-pointer active:opacity-65" onClick={() => {setPopoverOpen(!popoverOpen)}}><MdExpandMore color="white" size={27} style={{transform: popoverOpen ? "rotateX(360deg)": "rotateX(180deg)", transition:"transform 0.15s linear"}}/></div>} variant="flat" placeholder="Search Artists, Tracks, Genres" />
            </div>
            <div>
                <p className="p-0 m-0 text-xl">
                    Ingredients
                </p>
            </div>
            <div className="flex flex-col justify-center items-center px-2 py-2 min-h-20">
                {
                ingredients.artists.length === 0 && ingredients.tracks.length === 0 && ingredients.genres.length === 0 ? 
                    <p className="opacity-65">
                        No Ingredients Added
                    </p> :
                    <div className="flex flex-col items-center justify-center">
                        {
                            ingredients.artists.map((item, index) => {
                                return (
                                    <div key={index}>
                                        {item.name}
                                    </div>
                                );
                            })
                        }
                        {
                            ingredients.tracks.map((item, index) => {
                                return (
                                    <div key={index}>
                                        {item.name}
                                    </div>
                                );
                            })
                        }
                    </div>
                }
            </div>
        </div>
    )
}