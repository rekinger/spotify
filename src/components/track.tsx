import { api } from '@/src/trpc/react';
import { Skeleton } from "@nextui-org/skeleton";
import { Tooltip } from "@nextui-org/tooltip";
import localFont from 'next/font/local';
import NextImage from "next/image";
import { useRef, useState } from "react";
import { MdOutlineQueue } from "react-icons/md";
import { toast } from 'sonner';
import type { Artist, Image } from "../types/types";

const myFont = localFont({ src: '../public/CircularStd-Black.otf' })

function getDuration(ms: number): string {
    const date = new Date(ms);

    let seconds = date.getSeconds().toString()

    if(parseInt(seconds) < 10) {
        seconds = "0" + seconds
    }
    return `${date.getMinutes()}:${seconds}`
}

export function Track({ name, ms, artists, albumImages, uri }: { name: string, ms: number, artists: Artist[], albumImages: Image[], uri: string}) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const mixMutation = api.me.addToQueue.useMutation()
    const inProgressRef = useRef(false) // Use a ref to keep track of the function call status

    const addClicked = () => {
        if (inProgressRef.current) {
            return;
        }

        inProgressRef.current = true;
        
        toast.promise(addToQueue, {
            loading: 'Loading...',
            className: myFont.className,
            success: () => {
                inProgressRef.current = false
                return `Song added to queue`;
            },
            error: () => {
                inProgressRef.current = false
                return "Error adding song to queue. Ensure you have an active spotify listening session."
            } 
        });
    };

    function addToQueue(): Promise<string> {
        //Tack on 400 ms delay to prevent user from spamming too much
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                try {
                    const result = await mixMutation.mutateAsync({ uri: uri });
                    resolve(result.result)
                    return result.result;
                } catch {
                    reject()
                }
            }, 400)
        })
    }

    return (
        <div className="flex track w-full rounded-md py-3 items-center">
            <div className="relative w-14 h-14">
                <Skeleton className="h-14 w-14 absolute top-0 left-0" style={{ opacity: imageLoaded ? 0 : 1 }} />
                <NextImage onLoad={() => setImageLoaded(true)} unoptimized alt="Album Image" src={albumImages.length > 0 ? albumImages[0].url : ""} height={56} width={56} />
            </div>
            <div className="flex flex-col ml-2 truncate max-w-[calc(100%-56px-32px-75px)]">
                <p className="truncate">{name}</p>
                <p className="opacity-75 truncate">{artists.map(artist => artist.name).join(", ")}</p>
            </div>
            <div className="flex items-center gap-x-6 ml-auto pl-2">
                <p className="opacity-75">{getDuration(ms)}</p>
                <Tooltip className={myFont.className} placement="right" content={"Add to Spotify Queue"}>
                    <div onClick={addClicked} className="flex items-center justify-center h-full cursor-pointer active:opacity-75">
                        <MdOutlineQueue color={'white'} size={20} />
                    </div>
                </Tooltip>
            </div>
        </div>
    )
}