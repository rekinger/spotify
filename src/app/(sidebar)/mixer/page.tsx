
'use client'

import { Ingredient as IngredientComponent } from '@/src/components/ingredient';
import { SearchArtist } from '@/src/components/searchartist';
import { SearchTrack } from '@/src/components/searchtrack';
import { api } from '@/src/trpc/react';
import type { Artist, Ingredient, Track as TrackType } from "@/src/types/types";
import { Button } from '@nextui-org/button';
import { Input } from "@nextui-org/input";
import { Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/modal';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { Tab, Tabs } from '@nextui-org/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdExpandMore } from "react-icons/md";
import { useDebouncedCallback } from 'use-debounce';

export default function Mixer() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
    const searchMutation = api.me.search.useMutation({})
    const [currData, setCurrData] = useState<{ artists: Artist[], tracks: TrackType[], genres:string[] } | null>(null);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const debouncedSearch = useDebouncedCallback (
        (value: string) => {
            value = value.replace(/^\s+/, '');

            if(value.length === 0) {
                setPopoverOpen(false)
            }
            else {
                setPopoverOpen(true)
            }

            if(value.length < 3) {
                searchMutation.reset()
                setCurrData(null)
            }
            else {
                searchMutation.mutate({search:value})
            }
        },
        400
      );

    useEffect(() => {
        if(searchMutation.data) {
            setCurrData(searchMutation.data)
        }
    }, [searchMutation.data])

    return (
        <div className="flex flex-1 relative w-11/12 sm:w-5/6 px-2 sm:px-6 flex-col page-body gap-y-4 overflow-hidden">
            <Modal scrollBehavior="inside" size={"2xl"}  className='z-50' isOpen={isOpen} onOpenChange={onOpenChange} classNames={{
                backdrop: "overflow-y-hidden"
            }}>
                                    <ModalContent>
                                        <ModalBody className=''>
                                        <div className='flex flex-col h-56 overflow-scroll overflow-x-hidden'>
                                        <span> 
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Nullam pulvinar risus non risus hendrerit venenatis.
                                        Pellentesque sit amet hendrerit risus, sed porttitor quam.
                                        </span>
                                        <span>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Nullam pulvinar risus non risus hendrerit venenatis.
                                        Pellentesque sit amet hendrerit risus, sed porttitor quam.
                                        </span>
                                        <span>
                                        Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                                        dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. 
                                        Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. 
                                        Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur 
                                        proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                                        </span>
                                        </div>
                                        </ModalBody>
                                    </ModalContent>
                                </Modal>
            <div className="relative flex flex-row pt-8">
                <AnimatePresence>
                    {
                        popoverOpen ? (
                                <motion.div initial={{ opacity: 0, top: 80 }} animate={{ opacity: 1, top: 75,}} exit={{opacity:0, top:80}} transition={{duration:0.15}} className="absolute flex flex-col items-center justify-start w-full h-auto max-h-[70dvh] overflow-x-hidden rounded-md top-20 left-0 px-4 z-20 pt-2 bg-[#191919]">
                                    <Tabs variant={'underlined'} aria-label="Tabs">
                                        <Tab key="artists" title="Artists" className="flex flex-col w-full items-center justify-start overflow-scroll overflow-x-hidden">
                                            <ScrollShadow size={20} className="flex flex-col items-center justify-start w-full px-0 sm:px-3">
                                                {
                                                    !currData || !currData?.artists.length  ? (
                                                        <p className="opacity-65">
                                                            No Artists Found - Ensure Search is 3+ Characters
                                                        </p>
                                                    ):
                                                    currData.artists.map((item, _index) => {
                                                        return (
                                                            <SearchArtist key={item.id} id={item.id} name={item.name} images={item.images} genres={item.genres} setIngredients={setIngredients} added={ingredients.some(ingredient => ingredient.id === item.id)}/>
                                                        )
                                                    })
                                                }
                                            </ScrollShadow>
                                        </Tab>
                                        <Tab key="tracks" title="Tracks" className="flex flex-col w-full items-center justify-start overflow-scroll overflow-x-hidden">
                                            <ScrollShadow size={20} className="flex flex-col items-center justify-start w-full px-0 sm:px-3">
                                                {
                                                    !currData || !currData?.tracks.length  ? (
                                                        <p className="opacity-65">
                                                            No Artists Found - Ensure Search is 3+ Characters
                                                        </p>
                                                    ):
                                                    currData.tracks.map((item, _index) => {
                                                        return (
                                                            <SearchTrack key={item.id} id={item.id} name={item.name} artists={item.artists} albumImages={item.album.images} setIngredients={setIngredients} added={ingredients.some(ingredient => ingredient.id === item.id)}/>
                                                        )
                                                    })
                                                }
                                            </ScrollShadow>
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
                <Input className="z-20" onFocus={() => {setPopoverOpen(true)}} onChange={(e) => debouncedSearch(e.target.value)} spellCheck={false} classNames={{
                    inputWrapper: ["bg-[#191919] hover:!bg-[#202020] focus-within:!bg-[#191919] rounded-md"], input: "text-md"
                    }} startContent={<FaSearch color={'rgb(29, 185, 84)'} size={15}/>} endContent={<div className="cursor-pointer active:opacity-65" onClick={() => {setPopoverOpen(!popoverOpen)}}><MdExpandMore color="white" size={27} style={{transform: popoverOpen ? "rotate(360deg)": "rotate(180deg)", transition:"transform 0.2s linear"}}/></div>} variant="flat" placeholder="Search Artists, Tracks, Genres" />
            </div>
            <div>
                <p className="p-0 m-0 text-xl">
                    Ingredients
                </p>
            </div>
            <div className="flex flex-col items-center justify-start w-full overflow-scroll overflow-x-hidden pb-8">
                <AnimatePresence>
                    {
                        ingredients.length === 0 ? (
                            <p className="opacity-65">
                                No Ingredients Added
                            </p>
                        ):
                        (
                            ingredients.map((item, index) => {
                                return (
                                    <IngredientComponent key={"ingredient"+item.id} ingredient={item} setIngredients={setIngredients} index={index}/>
                                )
                            })
                        )
                    }
                    {
                        ingredients.length > 0 ? (
                            <motion.div exit={{opacity:0}}>
                                <Button onPress={onOpen} color="success" className="w-36 sm:w-44 md:w-48 lg:w-52 h-10 rounded-lg">
                                    <p className="font-bold text-lg p-0 m-0">
                                        Create Mix
                                    </p>
                                </Button> 
                            </motion.div>
                        ):
                        null
                    }
                </AnimatePresence>
            </div>
        </div>
    )
}
