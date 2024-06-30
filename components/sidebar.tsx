'use client'

import clsx from "clsx";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GiBackwardTime } from "react-icons/gi";
import { IoIosMusicalNotes, IoMdMicrophone, IoMdPerson } from "react-icons/io";

import localFont from 'next/font/local';

const myFont = localFont({ src: '../public/CircularStd-Black.otf' })

export const Sidebar = () => { 

    const currentPath = usePathname();

    return (
        <div className={"sidebar " + myFont.className}>
            <div className="sidebar-button-group">
                <Link href="/?history=/" className={clsx("sidebar-button", currentPath == "/" ? "sidebar-button-active":"")} >
                    <IoMdPerson color={"inherit"} size={25} />
                    <p className="sidebar-button-text">
                        Profile
                    </p>
                </Link>
                <Link href="/artists?history=/artists" className={clsx("sidebar-button", currentPath?.startsWith("/artists") ? "sidebar-button-active":"")}>
                    <IoMdMicrophone color={'inherit'} size={25} />
                    <p className="sidebar-button-text">
                        Top Artists
                    </p>
                </Link>
                <Link href="/tracks?history=/tracks" className={clsx("sidebar-button", currentPath?.startsWith("/tracks") ? "sidebar-button-active":"")}>
                    <IoIosMusicalNotes color={"inherit"} size={25} />
                    <p className="sidebar-button-text">
                        Top Tracks
                    </p>
                </Link>
                <Link href="/recent?history=/recent" className={clsx("sidebar-button", currentPath?.startsWith("/recent") ? "sidebar-button-active":"")}>
                    <GiBackwardTime color={"inherit"} size={25}/>
                    <p className="sidebar-button-text">
                        Recent
                    </p>
                </Link>
            </div>
        </div>
    )
}
