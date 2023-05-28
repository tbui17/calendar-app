import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth"
import { cert } from "firebase-admin/app";

if (!process.env.NEXT_FIREBASE_PROJECT_ID) throw new Error("Missing NEXT_FIREBASE_PROJECT_ID")
if (!process.env.NEXT_FIREBASE_CLIENT_EMAIL) throw new Error("Missing NEXT_FIREBASE_CLIENT_EMAIL")
if (!process.env.NEXT_FIREBASE_PRIVATE_KEY) throw new Error("Missing NEXT_FIREBASE_PRIVATE_KEY")
if (!process.env.NEXT_GOOGLE_ID) throw new Error("Missing NEXT_GOOGLE_ID")
if (!process.env.NEXT_GOOGLE_SECRET) throw new Error("Missing NEXT_GOOGLE_SECRET")

export const authOptions = {
  // Configure one or more authentication providers

  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_ID,
      clientSecret: process.env.NEXT_GOOGLE_SECRET,
      
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
const handler:any = NextAuth(authOptions)

export {handler as GET, handler as POST}