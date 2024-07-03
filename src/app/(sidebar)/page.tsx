'use client'
import defaultImage from '@/src/public/default.png';
import { api } from '@/src/trpc/react';
import Image from 'next/image';


export default function ProfileChild() {
  const me = api.me.getMe.useQuery()

  if(me.isLoading) {
    return (
      <div>
        Loading
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <Image className="rounded-full" unoptimized alt="Profile Picture" src={me.data?.image || defaultImage} height={150} width={150}/>
      <p className="text-2xl">
        {
          me.data?.name
        }
      </p>
    </div>
  )
}
