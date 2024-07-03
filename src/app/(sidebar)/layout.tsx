import "@/src/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";

import { Providers } from "./providers";

import { Sidebar } from "@/src/components/sidebar";
import { siteConfig } from "@/src/config/site";

import { NextBreadcrumb } from "@/src/components/testbreadcrumb";

import localFont from 'next/font/local';

import { Suspense } from "react";

import { Provider } from "@/src/components/provider";

import React from "react";

import { TRPCReactProvider } from "@/src/trpc/react";

const myFont = localFont({ src: '../../public/CircularStd-Black.otf' })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout  ({
  children
}: {
  children: React.ReactNode;
})  {

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          myFont.className
        )}
      >
        <TRPCReactProvider>
          <Providers>
            <Suspense>
              <div className={"main " + myFont.className}>
                  <Sidebar />
                  <div className="flex flex-1 flex-grow flex-col bg-red">
                  <NextBreadcrumb
                    separator={<span> {">"} </span>}
                    activeClasses='text-amber-500'
                    containerClasses='flex py-5 bg-gradient-to-r from-purple-600 to-blue-600'
                    listClasses='hover:underline mx-2 font-bold'
                    capitalizeLinks homeElement={undefined}              />
                  <React.Fragment>
                    <Provider>
                      {children}
                    </Provider>
                  </React.Fragment>
                  </div>
              </div>
            </Suspense>
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}