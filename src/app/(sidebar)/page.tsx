'use client'
import defaultImage from '@/src/public/default.png';
import { api } from '@/src/trpc/react';
import { signOut } from 'next-auth/react';
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
      <p className="text-2xl p-0">
        {
          me.data?.name
        }
      </p>
      <p className="opacity-70 text-center p-0">
        {
          me.data?.country
        } | {
          me.data?.email
        } | {
          me.data?.followers
        } followers
      </p>
      <button onClick={() => {signOut()}}>
        Sign Out
      </button>
    </div>
  )
}
