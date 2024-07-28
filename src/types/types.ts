import { StaticImageData } from "next/image";

export interface meSpotify {
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

export interface Item {
  track: Track,
  played_at: string,
  context: null
}

export interface RecentlyPlayed {
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

export interface Ingredient {
  image: string | StaticImageData,
  title: string,
  type: string,
  id: string
}

export interface Track {
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

export interface Album {
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

export interface Artist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
  popularity: number;
  genres: string[];
  images: Image[];
}

export interface Image {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SearchResult {
  artists: Artist[],
  tracks: Track[],
  genres: string[]
}