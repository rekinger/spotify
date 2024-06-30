import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const spotifyScopes = "playlist-read-private,playlist-modify-private"

async function refreshAccessToken(token) {
  try {
    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      'base64'
    )
    const { data } = await axios.post(
      SPOTIFY_REFRESH_TOKEN_URL,
      {
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      },
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: Date.now() + data.expires_in * 1000,
    }
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}

export const authOptions = {
    providers: [
        SpotifyProvider({
                clientId: process.env.SPOTIFY_CLIENT_ID || "",
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
                authorization: `https://accounts.spotify.com/authorize?scope=${spotifyScopes}`,
            })
        ],
        callbacks: { 
            async jwt({ token, user, account }) {
              if (account && user) {
                if(account.expires_at >= Date.now() - 10000) {
                  console.log("Token Expired")
                  const newToken = await refreshAccessToken(token)
                  return newToken
                }

                return {
                  accessToken: account.access_token,
                  refreshToken: account.refresh_token,
                  accessTokenExpires: account.expires_at,
                  user,
                }
              }
              if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
                return token
              }
              const newToken = await refreshAccessToken(token)
              return newToken
            },
            async session({ session, token }) {
              session.accessToken = token.accessToken
              session.error = token.error
              session.user = token.user
              session.refreshToken = token.refreshToken
              session.accessTokenExpires = token.accessTokenExpires
              return session
            },
          },
}

export default NextAuth(authOptions)