'use client'
import { Track } from '@/src/components/track';
import defaultImage from '@/src/public/default.png';
import { api } from '@/src/trpc/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

export default function ProfileChild() {
  const me = api.me.getMe.useQuery()
  const recent = api.me.getRecent.useQuery()

  if(me.isLoading) {
    return (
      <div>
        Loading
      </div>
    )
  }

  return (
    <div className="flex flex-1 w-11/12 sm:w-5/6 px-2 sm:px-4 flex-col page-body overflow-auto">
      <div className="flex flex-col justify-center items-center">
          <Image className="rounded-full" unoptimized alt="Profile Picture" src={me.data?.image || defaultImage} height={110} width={110}/>
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
      <div className="flex flex-col flex-1 min-h-0">
        {
          recent.data?.map((item, index) => {
            return (
              <Track name={item.track.name} ms={item.track.duration_ms} artists={item.track.artists} albumImages={item.track.album.images}/>
            )
          })
        }
      </div>
    </div>
  )
}
