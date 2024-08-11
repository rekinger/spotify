
'use client'

import { Ingredient as IngredientComponent } from '@/src/components/ingredient';
import { SearchArtist } from '@/src/components/searchartist';
import { SearchTrack } from '@/src/components/searchtrack';
import { Track } from '@/src/components/track';
import { api } from '@/src/trpc/react';
import type { Artist, Ingredient, Track as TrackType } from "@/src/types/types";
import { Button } from '@nextui-org/button';
import { Input, Textarea } from "@nextui-org/input";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/modal';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { Switch } from '@nextui-org/switch';
import { Tab, Tabs } from '@nextui-org/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import localFont from 'next/font/local';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom';
import { FaSearch } from "react-icons/fa";
import { ScaleLoader } from 'react-spinners';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';

const myFont = localFont({ src: '../../../public/CircularStd-Black.otf' })

export default function Mixer() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
    const searchMutation = api.me.search.useMutation()
    const mixMutation = api.me.createMix.useMutation()
    const saveMutation = api.me.saveMix.useMutation()
    const [currData, setCurrData] = useState<{ artists: Artist[], tracks: TrackType[], genres:string[] } | null>(null);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);
    const [searchTab, setSearchTab] = useState<string>("Artist")
    const [mixTitle, setMixTitle] = useState<string>("")
    const [mixDescription, setMixDescription] = useState<string>("")
    const [mixPublic, setMixPublic] = useState<boolean>(true)
    const [creatingMix, setCreatingMix] = useState<boolean>(false)
    const router = useRouter()


    async function saveMix() {
        setCreatingMix(true)
        const success = await saveMutation.mutateAsync({
            title: mixTitle,
            description: mixDescription,
            public: mixPublic,
            tracks: mixMutation.data?.tracks?.map(track => track.uri) || []
        })
        if(success.succeeded) {
            router.push("/mixer/mixes")
        }
        else {
            setCreatingMix(false)
        }
    }

    function Overlay() {
        return ReactDOM.createPortal(
            <div onClick={() => {setPopoverOpen(false)}} className="w-[100dvw] h-[100dvh] bg-black opacity-50 z-20 absolute top-0 left-0">
            </div>,
            document.getElementById("main") || document.body
        );
    }

    function LoadingOverlay() {
        return ReactDOM.createPortal(
            <div className="w-[100dvw] h-[100dvh] z-50 absolute top-0 left-0 flex justify-center items-center">
                <div className="w-full h-full absolute top-0 left-0 bg-black opacity-50">

                </div>
                <ScaleLoader
                    color={"rgb(29, 185, 84)"}
                    loading={true}
                    className="!opacity-100"
                    aria-label="Loading Spinner"
                />
            </div>,
            document.getElementById("main") || document.body
        );
    }
    
    

    function userImageUpload(event: ChangeEvent<HTMLInputElement>) {
        const reader = new FileReader();

        if(event.target.files && event.target.files.length > 0) {

            reader.onloadend = function() {
                if(reader.result) {
                    const sizeInBytes = 4 * Math.ceil((reader.result.toString().length / 3))*0.5624896334383812
                    const sizeInKb=sizeInBytes/1000

                    if(sizeInKb > 256) {
                        toast("File size too large! File size must be <= 256 Kb")
                    }
                    else {
                        setUploadedImage(reader.result.toString())
                    }
                }
            }

            reader.readAsDataURL(event.target.files[0])
        }
    }

    function createMix() {
        onOpen()

        const tracks: string[] = []
        const artists: string[] = []

        ingredients.forEach(ingredient => {
            if(ingredient.type == "Artist") {
                artists.push(ingredient.id)
            }
            else if(ingredient.type == "Track") {
                tracks.push(ingredient.id)
            }
        })

        mixMutation.mutate({artists: artists, tracks: tracks, genres:[]})

    }
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
            {popoverOpen && <Overlay />}
            {creatingMix && <LoadingOverlay />}
            <Modal scrollBehavior="inside" size="4xl"  className={'z-40 ' + myFont.className} isOpen={isOpen && !creatingMix} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="flex flex-col">
                        Your Mix
                    </ModalHeader>
                    <ModalBody>
                        <div className='flex flex-col h-[70dvh] justify-start items-center overflow-scroll overflow-x-hidden px-0 sm:px-3'>
                            <div className="flex flex-col w-full justify-center items-center">
                                {
                                    /*
                                    <div onClick={uploadFile} className="flex flex-col justify-center items-center cursor-pointer">
                                        <NextImage alt="uploaded image" height={100} width={100} src={uploadedImage ? uploadedImage: defaultImage}/>
                                        <p className="opacity-65">
                                            Customize Playlist Image
                                        </p>
                                    </div>
                                    */
                                }
                                <p className="self-start p-0 mb-[-2px]">
                                    Title
                                </p>
                                <Input value={mixTitle} onChange={(e) => {setMixTitle(e.target.value)}} classNames={{ inputWrapper: ["bg-[#1b1b1e] hover:!bg-[#1b1b1e] focus-within:!bg-[#1b1b1e] rounded-md"], input: "text-md"}} />
                                <p className="self-start p-0 mt-1 mb-[-2px]">
                                    Description
                                </p>
                                <Textarea value={mixDescription} onChange={(e) => {setMixDescription(e.target.value)}} classNames={{ inputWrapper: ["bg-[#1b1b1e] hover:!bg-[#1b1b1e] focus-within:!bg-[#1b1b1e] rounded-md"], input: "text-md"}} />
                                <div className="flex w-full justify-start mt-1">
                                    <Switch isSelected={mixPublic} onValueChange={setMixPublic} defaultSelected color="success">{mixPublic ? "Public": "Private"}</Switch>
                                </div>
                                <div className="flex w-full items-center justify-end mt-1">
                                    <Button onClick={saveMix} color="success" className="w-36 sm:w-44 h-10 rounded-lg">
                                        <p className="font-bold text-lg p-0 m-0">
                                            Save Mix
                                        </p>
                                    </Button> 
                                </div>
                                <div className="w-full text-lg flex justify-start mb-[-8px]">
                                    Tracks
                                </div>
                                <input ref={hiddenFileInput} style={{display:'none'}} onChange={(e) => userImageUpload(e)} type="file" id="img" name="img" accept="image/*" />
                            </div>
                            {
                                mixMutation.isPending ? (
                                    <div className="flex w-full h-full items-center justify-center">
                                        <ScaleLoader
                                            color={"rgb(29, 185, 84)"}
                                            loading={true}
                                            aria-label="Loading Spinner"
                                        />
                                    </div>
                                ):
                                (
                                    <motion.div initial={{marginTop:10, opacity:0}} animate={{marginTop:0, opacity:1}} className="flex flex-col w-full h-full justify-start items-center">
                                        {
                                            mixMutation.data?.tracks?.map((item, _index) => {
                                                return (
                                                    <Track key={"mix" + item.id} href={item.external_urls.spotify} uri={item.uri} name={item.name} ms={item.duration_ms} artists={item.artists} albumImages={item.album.images}/>
                                                )
                                            })
                                        }
                                    </motion.div>
                                )
                            }
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <div className="relative flex flex-row">
                <AnimatePresence>
                    {
                        popoverOpen ? (
                                <motion.div initial={{ opacity: 0, top: 48 }} animate={{ opacity: 1, top: 39,}} exit={{opacity:0, top:48}} transition={{duration:0.15}} className="absolute flex flex-col items-center justify-start w-full h-auto max-h-[60dvh] overflow-x-hidden rounded-md rounded-t-none left-0 px-4 z-30 pt-2 bg-[#191919]">
                                    {
                                        searchTab === "Artists" ? (
                                            <ScrollShadow size={30} className="flex flex-col items-center justify-start w-full px-3">
                                                {
                                                    !currData || !currData?.artists.length  ? (
                                                        <p className="opacity-65 py-4">
                                                            No Search Results
                                                        </p>
                                                    ):
                                                    currData.artists.map((item, _index) => {
                                                        return (
                                                            <SearchArtist key={item.id} id={item.id} name={item.name} images={item.images} genres={item.genres} setIngredients={setIngredients} added={ingredients.some(ingredient => ingredient.id === item.id)}/>
                                                        )
                                                    })
                                                }
                                            </ScrollShadow>
                                        ):
                                        searchTab === "Tracks" ? (
                                            <ScrollShadow size={30} className="flex flex-col items-center justify-start w-full px-0 sm:px-3">
                                                {
                                                    !currData || !currData?.tracks.length  ? (
                                                        <p className="opacity-65 py-4">
                                                            No Search Results
                                                        </p>
                                                    ):
                                                    currData.tracks.map((item, _index) => {
                                                        return (
                                                            <SearchTrack key={item.id} id={item.id} name={item.name} artists={item.artists} albumImages={item.album.images} setIngredients={setIngredients} added={ingredients.some(ingredient => ingredient.id === item.id)}/>
                                                        )
                                                    })
                                                }
                                            </ScrollShadow>
                                        ):
                                        null
                                    }
                                </motion.div>
                        ):
                        null
                    }
                </AnimatePresence>
                <Input className="z-30" onFocus={() => {setPopoverOpen(true)}} onChange={(e) => debouncedSearch(e.target.value)} spellCheck={false} classNames={{
                    inputWrapper: [`bg-[#191919] hover:!bg-[#191919] focus-within:!bg-[#191919] rounded- rounded-md ${popoverOpen ? 'rounded-b-none border-b border-[#252525]': ''}`], input: "text-md"
                    }} startContent={<FaSearch color={'rgb(29, 185, 84)'} size={20}/>} 
                    endContent={
                        <div className="flex flex-row items-center">
                            <ScrollShadow orientation='horizontal' className="max-w-[35vw] no-scroll overflow-x-auto border-l border-[#252525]">
                                <Tabs classNames={{
                                    tabContent: "group-data-[selected=true]:text-[#1DB954]"
                                }} size="sm" aria-label="Search Tabs" radius='none' variant='light' onSelectionChange={(key) => {
                                    setSearchTab(key.toString())
                                }}>
                                    <Tab key={"Artists"} title={"Artists"}>
                                    </Tab>
                                    <Tab key={"Tracks"} title={"Tracks"}>
                                    </Tab>
                                    <Tab key={"Genres"} title={"Genres"}>
                                    </Tab>
                                </Tabs>
                            </ScrollShadow>
                        </div>
                    } variant="flat" placeholder="Search" />
            </div>
            <div>
                <p className="p-0 mb-[-15px] text-xl">
                    Ingredients
                </p>
            </div>
            <motion.div layout="size" transition={{delay:0.3, duration:0.4}} className="flex flex-col items-center justify-start h-full w-full overflow-scroll overflow-x-hidden">
                <AnimatePresence>
                    {
                        ingredients.length === 0 ? (
                            <motion.p layout="position" className="opacity-65">
                                No Ingredients Added
                            </motion.p>
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
                            <motion.div layout="position" exit={{opacity:0}}>
                                <Button onPress={createMix} color="success" className="w-36 sm:w-44 md:w-48 lg:w-52 h-10 rounded-lg">
                                    <p className="font-bold text-lg p-0 m-0">
                                        Create Mix
                                    </p>
                                </Button> 
                            </motion.div>
                        ):
                        null
                    }
                </AnimatePresence>
            </motion.div>
        </div>
    )
}


/*
<ScrollShadow size={20} className="flex flex-col items-center justify-start w-full px-3">
                                                {
                                                    !currData || !currData?.artists.length  ? (
                                                        <p className="opacity-65">
                                                            No Search Results
                                                        </p>
                                                    ):
                                                    currData.artists.map((item, _index) => {
                                                        return (
                                                            <SearchArtist key={item.id} id={item.id} name={item.name} images={item.images} genres={item.genres} setIngredients={setIngredients} added={ingredients.some(ingredient => ingredient.id === item.id)}/>
                                                        )
                                                    })
                                                }
                                            </ScrollShadow>

                                            <ScrollShadow size={20} className="flex flex-col items-center justify-start w-full px-0 sm:px-3">
                                                {
                                                    !currData || !currData?.tracks.length  ? (
                                                        <p className="opacity-65">
                                                            No Search Results
                                                        </p>
                                                    ):
                                                    currData.tracks.map((item, _index) => {
                                                        return (
                                                            <SearchTrack key={item.id} id={item.id} name={item.name} artists={item.artists} albumImages={item.album.images} setIngredients={setIngredients} added={ingredients.some(ingredient => ingredient.id === item.id)}/>
                                                        )
                                                    })
                                                }
                                            </ScrollShadow>
*/