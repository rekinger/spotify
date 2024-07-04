import {
  createTRPCRouter,
  publicProcedure
} from "../trpc";

interface meSpotify {
    display_name: string,
    external_urls: {
      spotify: string,
    },
    href: string,
    id: string,
    images: [
      {
        url: string,
        height: number,
        width: number
      },
      {
        url: string,
        height: number,
        width: number
      }
    ],
    type: string,
    uri: string,
    followers: { href: string | null, total: number },
    country: string,
    product: string,
    explicit_content: { filter_enabled: boolean, filter_locked: boolean },
    email: string
}

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
          console.log(data)

          return {
              name: (data as meSpotify).display_name,
              url: (data as meSpotify).external_urls.spotify,
              image: (data as meSpotify).images.length > 0 ? (data as meSpotify).images[1].url: null,
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
    })
});
