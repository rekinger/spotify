import {
  Account,
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";

const spotifyScopes = "playlist-read-private playlist-modify-private user-read-private user-read-email user-follow-read user-read-recently-played user-top-read user-modify-playback-state";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    };
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    picture?: string | null | undefined,
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
  }
}

interface SpotifyJWT extends DefaultJWT {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  picture?: string | null | undefined,
}

interface SpotifyAccount extends Account {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface SpotifyRefresh {
  access_token: string,
  expires_in: number
}

async function refreshAccessToken(token: string) : Promise<SpotifyRefresh> {

  try {

    const request = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: `grant_type=refresh_token&refresh_token=${token}`,
      cache: "no-cache"
    });
  
    const response = await request.json()
    return {
      access_token: (response as SpotifyRefresh).access_token,
      expires_in: (response as SpotifyRefresh).expires_in
    }
    
  } catch (_error) {
    return {
      access_token: "none",
      expires_in: 0
    }
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          accessToken: (account as SpotifyAccount).access_token,
          refreshToken: (account as SpotifyAccount).refresh_token,
          accessTokenExpires: (account as SpotifyAccount).expires_at,
          picture: token.picture
        };
      }

      const defaultSpotifyJWT: SpotifyJWT = {
        ...token,
      };

      //console.log(Date.now(), "vs", (Date.now() / 1000) + defaultSpotifyJWT.accessTokenExpires)
      
    
      if(Date.now() > (defaultSpotifyJWT.accessTokenExpires * 1000) - 10000) {
        const refreshed = await refreshAccessToken(defaultSpotifyJWT.refreshToken)
        defaultSpotifyJWT.accessToken = refreshed.access_token
        defaultSpotifyJWT.accessTokenExpires = (Date.now() / 1000) + refreshed.expires_in
      } 


      return defaultSpotifyJWT;
    },
    session({ session, token }) {
      session.accessToken = (token as SpotifyJWT).accessToken;
      session.refreshToken = (token as SpotifyJWT).refreshToken;
      session.accessTokenExpires = (token as SpotifyJWT).accessTokenExpires;
      session.picture = (token as SpotifyJWT).picture
      return session;
    },
  },
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
      authorization: `https://accounts.spotify.com/authorize?scope=${spotifyScopes}`,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);