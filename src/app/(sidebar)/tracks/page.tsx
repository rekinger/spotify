"use client"
import { Track } from '@/src/components/track';
import { api } from '@/src/trpc/react';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { Tab, Tabs } from "@nextui-org/tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import { ScaleLoader } from "react-spinners";

export default function Tracks() {
    const [timeRange, setTimeRange] = useState("long_term");

    const topArtists = api.me.getTopTracks.useQuery({ time_range: timeRange }, {
        staleTime: 5 * 60 * 1000,
    });

    return (
        <motion.div layout="size" className="flex flex-1 flex-col w-11/12 sm:w-5/6 sm:px-4 overflow-y-scroll overflow-x-hidden">
            <div className="flex flex-col items-center justify-center md:flex-row  md:items-center md:justify-between ">
                <p className="text-2xl">
                    Top Tracks
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
                <ScrollShadow className="flex flex-1 flex-col w-full overflow-y-scroll overflow-x-hidden pb-3 pr-2 sm:pr-6 ">
                    <motion.div 
                        initial={{ opacity: 0, marginTop: 8 }}
                        animate={{ opacity: 1, marginTop: 0 }}
                        transition={{duration:0.3}}
                        className="flex flex-col">
                            {topArtists.data?.map((item, index) => (
                                <motion.div
                                    initial={{opacity:0}}
                                    animate={{opacity:1}}
                                    transition={{duration:0.5}}
                                    key={item.id}
                                    className={`w-full`}
                                >
                                    <Track href={item.external_urls.spotify} key={"track" + item.id} uri={item.uri} name={item.name} ms={item.duration_ms} artists={item.artists} albumImages={item.album.images} />
                                </motion.div>
                            ))}
                    </motion.div>
                </ScrollShadow>
            )}
        </motion.div>
    );
}