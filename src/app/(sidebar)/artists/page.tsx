"use client"
import { Artist } from '@/src/components/artist';
import { api } from '@/src/trpc/react';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { Tab, Tabs } from "@nextui-org/tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import { ScaleLoader } from "react-spinners";

export default function ArtistComponent() {
    const [timeRange, setTimeRange] = useState("long_term");

    const topArtists = api.me.getTopArtists.useQuery({ time_range: timeRange }, {
        staleTime: 5 * 60 * 1000,
    });

    return (
        <motion.div layout="size" className="flex flex-1 flex-col w-11/12 sm:w-5/6 sm:px-4 overflow-y-scroll overflow-x-hidden">
            <div className="flex mb-3 flex-col items-center justify-center md:flex-row  md:items-center md:justify-between ">
                <p className="text-2xl">
                    Top Artists
                </p>
                <Tabs variant={'underlined'} aria-label="Tabs" onSelectionChange={(key) => {
                    if (key === 'all-time') {
                        setTimeRange('long_term');
                    } else if (key === 'six-months') {
                        setTimeRange('medium_term');
                    } else if (key === '4-weeks') {
                        setTimeRange('short_term');
                    }
                }}>
                    <Tab key="all-time" title="All Time" />
                    <Tab key="six-months" title="Last 6 Months" />
                    <Tab key="4-weeks" title="Last 4 Weeks" />
                </Tabs>
            </div>
            {topArtists.isLoading ? (
                <div className="flex flex-1 w-full justify-center items-center">
                    <ScaleLoader
                        color={"rgb(29, 185, 84)"}
                        loading={true}
                        aria-label="Loading Spinner"
                    />
                </div>
            ) : (
                <ScrollShadow className="flex flex-1 flex-col w-full pb-5 overflow-y-scroll overflow-x-hidden">
                    <motion.div 
                        initial={{ opacity: 0, marginTop: 8 }}
                        animate={{ opacity: 1, marginTop: 0 }}
                        transition={{duration:0.3}}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                            {topArtists.data?.map((item, _index) => (
                                <motion.div
                                    initial={{opacity:0}}
                                    animate={{opacity:1}}
                                    transition={{duration:0.4}}
                                    key={item.id}
                                    className={`min-h-52 w-full`}
                                >
                                    <Artist name={item.name} images={item.images} id={item.id}/>
                                </motion.div>
                            ))}
                    </motion.div>
                </ScrollShadow>
            )}
        </motion.div>
    );
}