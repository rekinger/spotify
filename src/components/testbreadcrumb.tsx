// /components/NextBreadcrumb.tsx
'use client'

import React, { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

type TBreadCrumbProps = {
    homeElement: ReactNode,
    separator: ReactNode,
    containerClasses?: string,
    listClasses?: string,
    activeClasses?: string,
    capitalizeLinks?: boolean
}

export function NextBreadcrumb ({ separator, containerClasses, listClasses, activeClasses, capitalizeLinks}: TBreadCrumbProps)  {

    const paths = usePathname()
    const searchParams = useSearchParams()
    const params: { [key: string]: string } = {};
    searchParams?.forEach((value: string, key: string) => {
        params[key] = value
    })


        
    const pathNames = paths?.split('/').filter( path => path ) || []

    let homeElement: string

    if(pathNames.length == 0) {
        homeElement = "Profile"
    }
    else {
        homeElement = pathNames.shift() || ""
    }

    return (
        <div className='w-full'>
            <ul className={"breadcrumbs"}>
                <li className={listClasses}><Link href={homeElement == "Profile" ? "/?history=/": "/" + homeElement + "?history=/" + homeElement}>{homeElement[0].toUpperCase() + homeElement.slice(1, homeElement.length)}</Link></li>
                {pathNames.length > 0 && separator}
            {
                pathNames.map( (link, index) => {
                    let href = `/${pathNames.slice(0, index + 1).join('/')}`
                    let itemClasses = paths === href ? `${listClasses} ${activeClasses}` : listClasses
                    let itemLink = capitalizeLinks ? link[0].toUpperCase() + link.slice(1, link.length) : link
                    return (
                        <React.Fragment key={index}>
                            <li className={itemClasses} >
                                <Link href={href}>{itemLink}</Link>
                            </li>
                            {pathNames.length !== index + 1 && separator}
                        </React.Fragment>
                    )
                })
            }
            </ul>
        </div>
    )
}