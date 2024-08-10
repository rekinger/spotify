import defaultImage from '@/src/public/default.png';
import { getServerSession } from 'next-auth';
import Image from "next/image";
import { FaSpotify } from 'react-icons/fa';
import { authOptions } from '../server/auth';
import { CustomPopover } from './popover';


export async function Hero() {

    const session = await getServerSession(authOptions)
    
    return (
        <div className="flex w-11/12 sm:w-5/6 justify-between items-center sm:px-4 py-2 mb-2 border-b border-[#181818]">
            <FaSpotify color="rgb(29, 185, 84)" size={50}/>
            <div className="flex flex-col items-center justify-center text-center">
                <div className="relative flex flex-col h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 cursor-pointer rounded-full">
                    <Image className="rounded-full" unoptimized layout='fill' objectFit="cover" alt="Profile Picture" src={session?.picture || defaultImage} />
                    <CustomPopover />
                    
                </div>
                <p className="opacity-65 m-0 p-0">
                    {
                        session?.user.name
                    }
                </p>
            </div>
        </div>
    )
  }