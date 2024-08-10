import "@/src/styles/globals.css";
import clsx from "clsx";
import { Metadata } from "next";

import { Providers } from "./providers";

import { Hero } from "@/src/components/hero";
import { Sidebar } from "@/src/components/sidebar";
import { siteConfig } from "@/src/config/site";

import localFont from 'next/font/local';

import { Suspense } from "react";

import { Provider } from "@/src/components/provider";

import React from "react";

import { TRPCReactProvider } from "@/src/trpc/react";
import { Toaster } from "sonner";

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

export default function RootLayout  ({
  children
}: {
  children: React.ReactNode;
})  {

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "page-body sbg-background font-sans antialiased",
          myFont.className
        )}
      >
        <TRPCReactProvider>
          <Providers>
            <Suspense>
              <div className={"main " + myFont.className}>
              <Toaster toastOptions={{
                    className: 'bg-[#191919] border-1 border-[#242424] text-white',
                }} />
                  <Sidebar />
                  <div className="flex h-full content items-center justify-between flex-1 flex-col">
                    <React.Fragment>
                      <Provider>
                        <Hero />
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