'use client'
import { Track } from '@/src/components/track';
import defaultImage from '@/src/public/default.png';
import { api } from '@/src/trpc/react';
import { Tooltip } from '@nextui-org/tooltip';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import localFont from 'next/font/local';
import Image from 'next/image';
import { ScaleLoader } from 'react-spinners';

const myFont = localFont({ src: '../../public/CircularStd-Black.otf' })

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
    <div className="flex flex-1 w-11/12 sm:w-5/6 px-2 sm:px-6 flex-col page-body overflow-y-scroll overflow-x-hidden">
      <motion.div initial={{opacity:0, marginTop:8}} animate={{opacity:1, marginTop:0}} className="flex flex-col justify-center items-center">
          <Image className="rounded-full" unoptimized alt="Profile Picture" src={me.data?.image || defaultImage} height={110} width={110}/>
          <p className="text-3xl p-0">
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
        <p className="text-2xl">
          Recently Played
        </p>
      </div>
      <div className="flex flex-col flex-1">
        {
          recent.data?.map((item, index) => {
            const timeObj = new Date(item.played_at);
            const readableTime = timeObj.toLocaleString('en-US', {year:'numeric', month:'long', day:'2-digit', hour:'numeric', minute:'numeric'});
            return (
              <Tooltip key={item.track.id} closeDelay={0} className={`${myFont.className} p-2`} p-2 showArrow={true} placement="left" content={readableTime}>
                <motion.div initial={{opacity:0, marginTop:8}} animate={{opacity:1, marginTop:0}} className="h-full w-full">
                  <Track name={item.track.name} ms={item.track.duration_ms} artists={item.track.artists} albumImages={item.track.album.images}/>
                </motion.div>
              </Tooltip>
            )
          })
        }
        <div className='min-h-5 w-3'>
          <span></span>
        </div>
      </div>
    </div>
  )
}
