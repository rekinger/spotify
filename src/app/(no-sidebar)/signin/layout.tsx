import "@/src/styles/globals.css";
import clsx from "clsx";
import { Metadata, Viewport } from "next";

import { Providers } from "@/src/app/(sidebar)/providers";

import { siteConfig } from "@/src/config/site";


import localFont from 'next/font/local';

import { Suspense } from "react";

import { Provider } from "@/src/components/provider";

import React from "react";

const myFont = localFont({ src: '../../../public/CircularStd-Black.otf' })

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

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          myFont.className
        )}
      >
        <Suspense>
        <Providers>
          <div className={"main " + myFont.className}>
              <div className="flex flex-1 flex-grow flex-col justify-center items-center">
                <React.Fragment>
                  <Provider>
                    {children}
                  </Provider>
                </React.Fragment>
              </div>
          </div>
        </Providers>
        </Suspense>
      </body>
    </html>
  );
}