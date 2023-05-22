import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth"

const clientId = process.env.NEXT_GOOGLE_ID
const clientSecret = process.env.NEXT_GOOGLE_SECRET

if (!clientId || !clientSecret) {
    throw new Error(
        "Missing GOOGLE_ID or GOOGLE_SECRET environment variables. Did you forget to run 'cp .env.local.example .env.local'?"
    )
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  secret: process.env.NEXT_JWT_SECRET,
}
const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}