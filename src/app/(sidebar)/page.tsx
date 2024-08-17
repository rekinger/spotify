'use client'
import { MixCompact } from '@/src/components/mixcompact';
import { Track } from '@/src/components/track';
import defaultImage from '@/src/public/default.png';
import { api } from '@/src/trpc/react';
import { Button } from '@nextui-org/button';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaArrowRight } from "react-icons/fa";
import { ScaleLoader } from 'react-spinners';

export default function ProfileChild() {
  const me = api.me.getMe.useQuery(undefined, {staleTime: 20 * 60 * 1000})
  const recent = api.me.getRecent.useQuery(undefined, {staleTime: 60 * 1000})
  const mixes = api.me.getMixes.useQuery({ page: 0, type: "user" }, {
    staleTime: 5 * 60 * 1000,
  });

  const currentPath = usePathname();
  const searchParams = useSearchParams();

  let history = searchParams.get('history')
  let nexthistory

  if(!history) {
      history = "" 
      nexthistory = currentPath
  }
  else {
      nexthistory = history + "," + currentPath
  }

  if(me.isLoading || recent.isLoading || mixes.isLoading) {
    return (
      <div className="flex flex-1 h-full w-11/12 sm:w-5/6 px-2 sm:px-4 justify-center items-center">
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
    <ScrollShadow className="flex flex-1 w-11/12 sm:w-5/6 px-2 sm:px-6 flex-col page-body overflow-y-scroll overflow-x-hidden pt-8 pb-3">
      <motion.div initial={{opacity:0, marginTop:8}} animate={{opacity:1, marginTop:0}} className="flex flex-col justify-center items-center gap-y-1">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:h-44 md:w-44 lg:h-56 lg:w-56">
            <Image priority className="rounded-full" unoptimized layout="fill" objectFit="cover" alt="Profile Picture" src={me.data?.image || defaultImage} />
          </div>
          <p className="text-3xl p-0 m-0">
            {
              me.data?.name
            }
          </p>
          <Button onClick={() => signOut()} color="success" className="w-36 sm:w-44 md:w-48 lg:w-52 h-10 rounded-lg">
              <p className="font-bold text-lg p-0 m-0">
                  Sign Out
              </p>
          </Button> 
      </motion.div>
      {
        mixes.data?.length ? (
          <div className="mt-5 flex w-full justify-between">
            <p className="text-2xl">
              Your Mixes
            </p>
            <Link href={"/mixer/mixes?history=" + nexthistory} className="flex flex-row  items-center justify-center gap-x-1 text-[#1DB954] text-2xl hover:underline">
              <p>
                All Mixes
              </p>
              <FaArrowRight color={"#1DB954]"} size={20}/>
            </Link>
          </div>
        ):
        null
      }
      {
        mixes.data?.length ? (
          <motion.div initial={{opacity:0, marginTop:8}} animate={{opacity:1, marginTop:0}} className="flex flex-col flex-1">
          {
            mixes.data?.map((item, _index) => {
              return (
                  <MixCompact key={item.id} mix={item} />
              )
            })
          }
        </motion.div>
        ):
        null
      }
      <div className="mt-5">
        <p className="text-2xl">
          Recently Played
        </p>
      </div>
      <motion.div initial={{opacity:0, marginTop:8}} animate={{opacity:1, marginTop:0}} className="flex flex-col flex-1">
        {
          recent.data?.map((item, index) => {
            //const timeObj = new Date(item.played_at);
            //const readableTime = timeObj.toLocaleString('en-US', {year:'numeric', month:'long', day:'2-digit', hour:'numeric', minute:'numeric'});
            return (
                <Track href={item.track.external_urls.spotify} key={"track" + index + item.track.id} uri={item.track.uri} name={item.track.name} ms={item.track.duration_ms} artists={item.track.artists} albumImages={item.track.album.images}/>
            )
          })
        }
      </motion.div>
    </ScrollShadow>
  )
}
