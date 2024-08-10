"use client"

import { Button } from "@nextui-org/button"
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover"
import { signOut } from "next-auth/react"
import localFont from "next/font/local"
const myFont = localFont({ src: '../public/CircularStd-Black.otf' })

export function CustomPopover() {
    return (
        <Popover placement="bottom" >
                <PopoverTrigger className="absolute top-0 left-0 w-full h-full">
                    <div>
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
    )
}