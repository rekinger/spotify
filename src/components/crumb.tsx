'use client'

import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/breadcrumbs";
import localFont from "next/font/local";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type Crumb = string;
type CrumbList = Crumb[];

const myFont = localFont({ src: '../public/CircularStd-Black.otf' })

export const Crumb = () => { 

    const pathname = usePathname()

    const [crumbList, setCrumbList] = useState<CrumbList>([])
    
    useEffect(() => {

        let crumb = ["Home"]
        if(pathname != null && pathname !== "/") {
            crumb = pathname.split("/")
            crumb[0] = "Home"
        }

        let upperCrumb = crumb.map((value) => {
            return value[0].toUpperCase() + value.slice(1);
        });

        setCrumbList(upperCrumb)

    }, [pathname])

    return (
        <div className="breadcrumbs">
            <Breadcrumbs>
            {
                crumbList.map((_item, _index) => {
                    return (
                        <BreadcrumbItem underline="hover" key={_item} href={_item === "Home" ? "/": "/" + _item.toLowerCase()}>{_item}</BreadcrumbItem>
                    )
                })
            }
            </Breadcrumbs>
        </div>
    )
}