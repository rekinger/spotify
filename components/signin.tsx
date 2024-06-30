'use client'
import { signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const params: { [key: string]: string } = {};

export function SignInPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams();

  console.log(searchParams?.toString())

  searchParams?.forEach((value: string, key: string) => {
    params[key] = value
  })
    
    if(status === "loading") {
      return (
        <div>
          Loading
        </div>
      )
    }
    if (session) {
      return (
          <div>
            Signed in as {session?.user?.email} <br />
            <button onClick={() => signOut()}>Sign out</button>
          </div>
      )
    }
    return (
        <div>
          Not signed in <br />
          <button onClick={() => signIn('spotify', {callbackUrl: params["referer"] || "/"})}>Sign in</button>
        </div>
    )
  }
  