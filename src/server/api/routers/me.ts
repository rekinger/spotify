import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure
} from "../trpc";

import type { Artist, meSpotify, Playlist, RecentlyPlayed, Track } from "@/src/types/types";

const _genres: string[] =  ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"]

export const meRouter = createTRPCRouter({
  getMe: publicProcedure
    .query(async ({ctx}) => {

        const accessToken = ctx.session?.accessToken

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
    }),
    getTopArtists: publicProcedure
    .input(z.object({ time_range: z.string() }))
    .query(async ({input, ctx}) => {

        const accessToken = ctx.session?.accessToken

        const time_range = input.time_range

        try {
          const response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${time_range}`, {
              method:"GET",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
              }
            })
          
          const data = await response.json()

          //console.log(data.items)
          
          return (data.items as Artist[])
        }
        catch(error) {
          console.log("ERROR", error)
          return []
        }
    }),
    getTopTracks: publicProcedure
    .input(z.object({ time_range: z.string() }))
    .query(async ({input, ctx}) => {

        const accessToken = ctx.session?.accessToken

        const time_range = input.time_range

        try {
          const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}`, {
              method:"GET",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
              }
            })
          
          const data = await response.json()
          
          return (data.items as Track[])
        }
        catch(error) {
          console.log("ERROR", error)
          return []
        }
    }),
    search: publicProcedure
    .input(z.object({ search: z.string() }))
    .mutation(async ({input, ctx}) => {

        const accessToken = ctx.session?.accessToken

        let search = input.search
        search = search.replace(/^\s+/, '');
        search = search.replace(/&/g, '');

        if(search.length < 3) {
          return {
            artists: [],
            tracks: [],
            genres:[]
          }
        }

        const query = encodeURI(`https://api.spotify.com/v1/search?q=${search}&type=artist,track&limit=10`)

        try {
          const response = await fetch(query, {
              method:"GET",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
              }
            })
          
          const data = await response.json()

          return {
            artists: (data.artists.items as Artist[]),
            tracks: (data.tracks.items as Track[]),
            genres: []
          }
        }
        catch(error) {
          console.log("ERROR", error)
          return {
            artists: [],
            tracks: [],
            genres: []
          }
        }
    }),
    createMix: publicProcedure
    .input(z.object({ tracks: z.array(z.string()), artists: z.array(z.string()), genres: z.array(z.string()) }))
    .mutation(async ({input, ctx}) => {

      const accessToken = ctx.session?.accessToken

      if(input.artists.length + input.tracks.length + input.genres.length > 5) {
        throw new Error("Cannot make playlist with more than 5 seeds");
      }

      let artistString = ""
      if(input.artists.length > 0) {
        artistString = "seed_artists=" + input.artists.join()
      }

      let trackString = ""
      if(input.artists.length > 0) {
        trackString = artistString != "" ? "&":"" + "seed_tracks=" + input.tracks.join()
      }

      let genreString = ""
      if(input.artists.length > 0) {
        genreString = artistString != "" || trackString != "" ? "&":"" + "seed_genres=" + input.genres.join()
      }
      

      const query = encodeURI(`https://api.spotify.com/v1/recommendations?` + artistString + trackString + genreString)

        try {
          const response = await fetch(query, {
              method:"GET",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
              }
            })
          
          const data = await response.json()

          return {
            tracks: (data.tracks as Track[])
          }
        }
        catch(error) {
          console.log("ERROR", error)
          return {
            tracks: []
          }
        }
    }),
    addToQueue: publicProcedure
    .input(z.object({ uri: z.string() }))
    .mutation(async ({input, ctx}) => {

      const accessToken = ctx.session?.accessToken

      const query = encodeURI(`https://api.spotify.com/v1/me/player/queue?uri=${input.uri}`)
      console.log(query)

        try {
          const response = await fetch(query, {
              method:"POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
              }
            })

          try {
            const data = await response.json()
            if(data.error) {
              if(data.error.reason === "NO_ACTIVE_DEVICE") {
                throw new Error("No Active Devices!");
              }
            }
            else if(response.status == 204 || response.status == 200) {
              return {
                result: "success"
              }
            }

              throw new Error("Spotify returned an error");
          }
          catch {
            if(response.status == 204 || response.status == 200) {
              return {
                result: "success"
              }
            }
            throw new Error("Spotify returned an error");
          }
        }
        catch(error) {
          throw new Error("Spotify returned an error");
        }
    }),
    saveMix: publicProcedure
    .input(z.object({ title: z.string(), description: z.string(), public: z.boolean(), tracks: z.array(z.string()) }))
    .mutation(async ({input, ctx}) => {

      if(!ctx.session) {
        return {
          succeeded: false
        }
      }

      let title = input.title
      title = title.replace(/^\s+/, '');

      let description = input.description
      description = description.replace(/^\s+/, '');

      const accessToken = ctx.session?.accessToken

      const query = encodeURI(`https://api.spotify.com/v1/users/${ctx.session?.user.id}/playlists`)

      const requestData = {
        name: title.length ? title: "Playlist Created At makeamix.vercel.app",
        public: input.public,
        description: description
    };

      try {
        const response = await fetch(query, {
          method:"POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify(requestData)
        })

        const data = await response.json()

        //console.log("DATA", data)

        const addSongsData = {
          uris: input.tracks
        }
        const addSongsQuery = encodeURI(`https://api.spotify.com/v1/playlists/${(data as Playlist).id}/tracks`)
        await fetch(addSongsQuery, {
          method:"POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          },
          body: JSON.stringify(addSongsData)
        })

        const finalPlaylistQuery = encodeURI(`https://api.spotify.com/v1/playlists/${(data as Playlist).id}`)
        const finalPlaylistResponse = await fetch(finalPlaylistQuery, {
          method:"GET",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          }
        })

        const finalPlaylistData = await finalPlaylistResponse.json()

        console.log("FINAL DATA:", finalPlaylistData)

        const insertMix = await ctx.db.mix.create({
          data: {
            spotifyPlaylistId: (finalPlaylistData as Playlist).id,
            spotifyUserImage: ctx.session?.picture || "",
            spotifyPlaylistImage: (finalPlaylistData as Playlist).images.length > 0 ? (finalPlaylistData as Playlist).images[0].url: "",
            spotifyUserUrl: (finalPlaylistData as Playlist).owner.external_urls.spotify,
            title: (finalPlaylistData as Playlist).name,
            spotifyUserID: ctx.session.user.id,
            description: description,
            public: (finalPlaylistData as Playlist).public,
            username: ctx.session?.user.name || "",
            url: (finalPlaylistData as Playlist).external_urls.spotify
          }
        })

        return {
          succeeded: !!insertMix
        }

      }
      catch {
        return {
          succeeded: false
        }
      }
    }),
    getMixes: publicProcedure
    .input(z.object({ type: z.string(), page: z.number() }))
    .query(async ({input, ctx}) => {

        const accessToken = ctx.session?.accessToken
        const type = input.type
        const page = input.page

        if(!accessToken || !(type == "user" || type == "all")) {
          throw new Error("Bad Query")
        }

        if(type == "all") {
          const data = await ctx.db.mix.findMany({
            take: 12,
            skip: page * 12,
            where: {
              OR: [
                {
                  spotifyUserID: ctx.session?.user.id
                },
                {
                  public: true
                }
              ]
            },
            orderBy: {
              createdAt:'desc'
            }
          })

          return data
        }
        
        const data = await ctx.db.mix.findMany({
          take: 12,
          skip: page * 12,
          where: {
            spotifyUserID: ctx.session?.user.id
          },
          orderBy: {
            createdAt:'desc'
          }
        })

        return data
    }),
    getMixesCount: publicProcedure
    .input(z.object({type: z.string()}))
    .query(async ({input, ctx}) => {

        const type = input.type
        const accessToken = ctx.session?.accessToken
        if(!accessToken || !(type == "user" || type == "all")) {
          throw new Error("Bad Query")
        }

        if(type == "all") {
          const data = await ctx.db.mix.count({
            where: {
              OR: [
                {
                  spotifyUserID: ctx.session?.user.id
                },
                {
                  public: true
                }
              ]
            }
          })

          return Math.ceil(data / 12)
        }
        
        const data = await ctx.db.mix.count({
          where: {
            spotifyUserID: ctx.session?.user.id
          }
        })

        return Math.ceil(data / 12)
    }),
});
