"use client"
import { Mix } from '@/src/components/mix';
import { api } from '@/src/trpc/react';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { Tab, Tabs } from "@nextui-org/tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import { ScaleLoader } from "react-spinners";

export default function ArtistComponent() {
    const [type, setType] = useState("user");

    const mixes = api.me.getMixes.useQuery({ page: 0, type: type }, {
        staleTime: 5 * 60 * 1000,
    });

    return (
        <motion.div layout="size" className="flex flex-1 flex-col w-11/12 sm:w-5/6 sm:px-4 overflow-y-scroll overflow-x-hidden">
            <div className="flex flex-col items-center justify-center md:flex-row pb-2 md:items-center md:justify-between ">
                <p className="text-3xl">
                    Mixes
                </p>
                <Tabs variant={'underlined'} aria-label="Tabs" onSelectionChange={(key) => {
                    if (key === 'user') {
                        setType('user');
                    } else if (key === 'all') {
                        setType('all');
                    }
                }}>
                    <Tab key="user" title="Your Mixes" />
                    <Tab key="all" title="All Mixes" />
                </Tabs>
            </div>
            {mixes.isLoading ? (
                <div className="flex flex-1 w-full justify-center items-center">
                    <ScaleLoader
                        color={"rgb(29, 185, 84)"}
                        loading={true}
                        aria-label="Loading Spinner"
                    />
                </div>
            ) : (
                <ScrollShadow className="flex flex-1 flex-col w-full pb-5 overflow-y-scroll overflow-x-hidden pr-2">
                    <motion.div 
                        initial={{ opacity: 0, marginTop: 8 }}
                        animate={{ opacity: 1, marginTop: 0 }}
                        transition={{duration:0.3}}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10 w-full">
                            {mixes.data?.map((item, _index) => (
                                <motion.div
                                    initial={{opacity:0}}
                                    animate={{opacity:1}}
                                    transition={{duration:0.4}}
                                    key={item.id}
                                    className={`min-h-52 w-full`}
                                >
                                    <Mix mix={item}/>
                                </motion.div>
                            ))}
                    </motion.div>
                </ScrollShadow>
            )}
        </motion.div>
    );
}