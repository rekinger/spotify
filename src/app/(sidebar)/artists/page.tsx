"use client"
import { Artist } from '@/src/components/artist';
import { api } from '@/src/trpc/react';
import { Tab, Tabs } from "@nextui-org/tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import { ScaleLoader } from "react-spinners";

export default function artist() {
 
    const [detailedView, setDetailedView] = useState(false)
    const topArtists = api.me.getTopArtists.useQuery()

    if(topArtists.isLoading) {
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
        <div className="flex flex-1 flex-col w-11/12 sm:w-5/6 px-2 sm:px-4 overflow-y-scroll">
            <div className="flex mt-4 mb-3 flex-col items-center justify-center md:flex-row  md:items-center md:justify-between ">
                <p className="text-2xl">
                    Top Artists
                </p>
                <button onClick={() => {setDetailedView(!detailedView)}}>
                    Switch Layout
                </button>
                <Tabs variant={'underlined'} aria-label="Tabs">
                    <Tab key="all-time" title="All Time"/>
                    <Tab key="six-months" title="Last 6 Months"/>
                    <Tab key="4-weeks" title="Last 4 Weeks"/>
                </Tabs>
            </div>
            <motion.div 
                layout
                transition={{duration:2}}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
            >
                {topArtists.data?.map((item, index) => (
                    <motion.div 
                        key={index} 
                        className={`min-h-52 w-full ${detailedView ? 'col-span-full' : ''}`}
                        initial={{ opacity: 0, marginTop:8 }}
                        animate={{ opacity: 1, marginTop:0 }}
                    >
                        <Artist name={item.name} images={item.images} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}