'use client'
import { Track } from '@/src/components/track';
import defaultImage from '@/src/public/default.png';
import { api } from '@/src/trpc/react';
import { Button } from '@nextui-org/button';
import { Tooltip } from '@nextui-org/tooltip';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import localFont from 'next/font/local';
import Image from 'next/image';
import { ScaleLoader } from 'react-spinners';

const myFont = localFont({ src: '../../public/CircularStd-Black.otf' })

export default function ProfileChild() {
  const me = api.me.getMe.useQuery(undefined, {staleTime: 20 * 60 * 1000})
  const recent = api.me.getRecent.useQuery(undefined, {staleTime: 5 * 60 * 1000})

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
    <div className="flex flex-1 w-11/12 sm:w-5/6 px-2 sm:px-6 flex-col page-body overflow-y-scroll overflow-x-hidden">
      <motion.div initial={{opacity:0, marginTop:8}} animate={{opacity:1, marginTop:0}} className="flex flex-col justify-center items-center gap-y-1">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:h-44 md:w-44 lg:h-56 lg:w-56">
            <Image className="rounded-full" unoptimized layout="fill" objectFit="cover" alt="Profile Picture" src={me.data?.image || defaultImage} />
          </div>
          <p className="text-3xl p-0 m-0">
            {
              me.data?.name
            }
          </p>
          <p className="opacity-70 text-center p-0 m-0">
            {
              me.data?.country
            } | {
              me.data?.email
            } | {
              me.data?.followers
            } followers
          </p>
          <Button onClick={() => signOut()} color="success" className="w-36 sm:w-44 md:w-48 lg:w-52 h-10 rounded-lg">
              <p className="font-bold text-lg p-0 m-0">
                  Sign Out
              </p>
          </Button> 
      </motion.div>
      <div className="mt-5">
        <p className="text-2xl">
          Recently Played
        </p>
      </div>
      <motion.div initial={{opacity:0, marginTop:8}} animate={{opacity:1, marginTop:0}} className="flex flex-col flex-1">
        {
          recent.data?.map((item, index) => {
            const timeObj = new Date(item.played_at);
            const readableTime = timeObj.toLocaleString('en-US', {year:'numeric', month:'long', day:'2-digit', hour:'numeric', minute:'numeric'});
            return (
              <Tooltip key={item.track.id} closeDelay={0} className={`${myFont.className} p-2`} p-2 showArrow={true} placement="left" content={readableTime}>
                  <Track name={item.track.name} ms={item.track.duration_ms} artists={item.track.artists} albumImages={item.track.album.images}/>
              </Tooltip>
            )
          })
        }
        <div className='min-h-5 w-3'>
          <span></span>
        </div>
      </motion.div>
    </div>
  )
}
