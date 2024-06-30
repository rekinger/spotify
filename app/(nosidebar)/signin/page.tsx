'use client'
import { Button } from "@nextui-org/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FaSpotify } from "react-icons/fa";
import { ScaleLoader } from "react-spinners";

const params: { [key: string]: string } = {};

export default function SignInPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams();

  console.log(searchParams?.toString())

  searchParams?.forEach((value: string, key: string) => {
    params[key] = value
  })
    
    if(status === "loading") {
      return (
        <div>
            <ScaleLoader
                color={"rgb(29, 185, 84)"}
                loading={true}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
      )
    }
    if (session) {
      return (
        <div className="flex flex-col h-full w-full justify-center items-center gap-5">
            <Image alt="Profile Picture" height={100} width={100} className="rounded-full" src={session.user?.image || ""}/>
            <Button onClick={() => {signOut()}} color="success" className="w-5/6 max-w-80 min-w-72 min-h-12">
                <p className="font-bold text-lg">
                    Sign Out
                </p>
            </Button>  
        </div>
      )
    }
    return (
        <div className="flex flex-col h-full w-full justify-center items-center gap-5">
            <FaSpotify color="rgb(29, 185, 84)" size={100}/>
            <Button onClick={() => signIn('spotify', {callbackUrl: params["referer"] || "/"})} color="success" className="w-5/6 max-w-80 min-w-72 min-h-12">
                <p className="font-bold text-lg">
                   Continue With Spotify 
                </p>
            </Button>  
        </div>
    )
  }
  

  //<button onClick={() => signIn('spotify', {callbackUrl: params["referer"] || "/"})}>Sign in</button>