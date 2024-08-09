import defaultImage from '@/src/public/default.png';
import { getServerSession } from 'next-auth';
import Image from "next/image";
import { authOptions } from '../server/auth';
import { CustomPopover } from './popover';


export async function Hero() {

    const session = await getServerSession(authOptions)
    
    return (
        <div className="flex w-11/12 sm:w-5/6 justify-end sm:px-4 py-2 mb-auto">
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 cursor-pointer rounded-full">
                <Image className="rounded-full" unoptimized layout='fill' objectFit="cover" alt="Profile Picture" src={session?.picture || defaultImage} />
                <CustomPopover />
            </div>
        </div>
    )
  }