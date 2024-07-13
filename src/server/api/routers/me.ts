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

interface Item {
  track: Track,
  played_at: string,
  context: null
}
interface RecentlyPlayed {
  items: Array<{
    track: Track;
    played_at: string;
    context: null;
  }>;
  next: string;
  cursors: {
    after: string;
    before: string;
  };
  limit: number;
  href: string;
}

interface Items {

}

interface Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
}

interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface Artist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface Image {
  url: string;
  height: number | null;
  width: number | null;
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
