"use client"

import localFont from "next/font/local"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { FaArrowLeft } from "react-icons/fa"
const myFont = localFont({ src: '../public/CircularStd-Black.otf' })

export function BackButton() {

    const searchParams = useSearchParams();
    const currentPath = usePathname();

    let history = searchParams.get('history')
    let backOne
    let historyList: string[] = []

    if(history) {
        historyList = history.split(',')
        backOne = historyList.pop()

        console.log(historyList)
        console.log(backOne)
    }
    
    return (
        <Link href={(backOne || currentPath) + (historyList.length ? "?history=" + historyList.join(',') : "" ) } className="p-2 rounded-full bg-[#202020]" style={{cursor: backOne ? "pointer": "default"}}>
            <FaArrowLeft color={"white"} size={20} style={{opacity: backOne ? 1: 0.4}}/>
        </Link>
    )
}