'use client'
import { Track } from '@/src/components/track';
import defaultImage from '@/src/public/default.png';
import { api } from '@/src/trpc/react';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { ScaleLoader } from 'react-spinners';

export default function ProfileChild() {
  const me = api.me.getMe.useQuery()
  const recent = api.me.getRecent.useQuery()

  if(me.isLoading || recent.isLoading) {
    return (
      <div className="flex flex-1 w-11/12 sm:w-5/6 px-2 sm:px-4 justify-center items-center">
        <ScaleLoader
          color={"rgb(29, 185, 84)"}
          loading={true}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    )
  }
 
  return (
    <div className="flex flex-1 w-11/12 sm:w-5/6 px-2 sm:px-6 flex-col page-body overflow-y-scroll">
      <motion.div initial={{opacity:0, marginTop:8}} animate={{opacity:1, marginTop:0}} className="flex flex-col justify-center items-center">
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
      </motion.div>
      <div className="mt-4">
        <p className="text-3xl">
          Recently Played
        </p>
      </div>
      <div className="flex flex-col flex-1">
        {
          recent.data?.map((item, index) => {
            return (
              <Track name={item.track.name} ms={item.track.duration_ms} artists={item.track.artists} albumImages={item.track.album.images} lastPlayed={item.played_at}/>
            )
          })
        }
      </div>
    </div>
  )
}
