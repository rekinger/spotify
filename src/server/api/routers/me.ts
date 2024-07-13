import {
  createTRPCRouter,
  publicProcedure
} from "../trpc";

import type { meSpotify, RecentlyPlayed } from "@/src/types/types";



export const meRouter = createTRPCRouter({
  getMe: publicProcedure
    .query(async ({ctx}) => {

        const accessToken = ctx.session?.accessToken
        console.log(accessToken)

        try {
          const response = await fetch("https://api.spotify.com/v1/me", {
              method:"GET",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
              }
            })
          
          const data = await response.json()

          return {
              name: (data as meSpotify).display_name,
              url: (data as meSpotify).external_urls.spotify,
              image: (data as meSpotify).images.length > 1 ? (data as meSpotify).images[1].url: (data as meSpotify).images.length > 0 ? (data as meSpotify).images[0].url: null,
              followers: (data as meSpotify).followers.total,
              country: (data as meSpotify).country,
              email: (data as meSpotify).email
          };
        }
        catch(error) {
          console.log("ERROR", error)
          return {
            name: "Server Error",
            url: "",
            image: null,
            followers: "",
            country: "",
            email: ""
          };
        }
    }),
    getRecent: publicProcedure
    .query(async ({ctx}) => {

        const accessToken = ctx.session?.accessToken

        try {
          const response = await fetch("https://api.spotify.com/v1/me/player/recently-played", {
              method:"GET",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
              }
            })
          
          const data = await response.json()
          
          return (data as RecentlyPlayed).items
        }
        catch(error) {
          console.log("ERROR", error)
          return []
        }
    })
});
