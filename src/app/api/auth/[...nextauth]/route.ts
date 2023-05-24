import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_ID||"",
      clientSecret: process.env.NEXT_GOOGLE_SECRET || "",
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