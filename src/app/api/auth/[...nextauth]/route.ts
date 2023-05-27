import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth"
import { cert } from "firebase-admin/app";

export const authOptions = {
  // Configure one or more authentication providers
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.NEXT_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.NEXT_FIREBASE_PRIVATE_KEY,
    }),
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_ID||"",
      clientSecret: process.env.NEXT_GOOGLE_SECRET || "",
      
      authorization: {
        
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.email"
        }
      }
    })
  ],
  secret: process.env.NEXT_JWT_SECRET,
  
}
const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}