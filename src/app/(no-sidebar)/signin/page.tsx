'use client'
import { Button } from "@nextui-org/button";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FaSpotify } from "react-icons/fa";

const params: { [key: string]: string } = {};

export default function SignInPage() {
  const searchParams = useSearchParams();

  searchParams?.forEach((value: string, key: string) => {
    params[key] = value
  })
  
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