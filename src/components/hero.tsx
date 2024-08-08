"use client";
import defaultImage from '@/src/public/default.png';
import { Button } from '@nextui-org/button';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover';
import { signOut, useSession } from "next-auth/react";
import localFont from 'next/font/local';
import Image from "next/image";

const myFont = localFont({ src: '../public/CircularStd-Black.otf' })

export function Hero() {
    const { data: session } = useSession()

    return (
        <div className="flex w-11/12 sm:w-5/6 justify-end sm:px-4 py-2 mb-auto">
            <Popover placement="bottom" >
                <PopoverTrigger>
                    <div className="relative h-14 w-14 cursor-pointer rounded-full">
                        <Image className="rounded-full" unoptimized layout="fill" objectFit="cover" alt="Profile Picture" src={session?.picture || defaultImage} />
                    </div>
                </PopoverTrigger>
                <PopoverContent className={myFont.className + " p-0"}>
                    <Button onClick={() => signOut()} color="success" className="w-36 sm:w-44 md:w-48 lg:w-52 h-10 rounded-lg">
                        <p className="font-bold text-lg p-0 m-0">
                            Sign Out
                        </p>
                    </Button> 
                </PopoverContent>
            </Popover>
        </div>
    )
  }