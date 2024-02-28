import NextAuth, { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/src/lib/prisma" 
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const githubId = process.env.GITHUB_ID;
const githubSecret = process.env.GITHUB_SECRET;

const googleId = process.env.GOOGLE_ID;
const googleSecret = process.env.GOOGLE_SECRET;

if(!githubId || !githubSecret || !googleId || !googleSecret){
    throw new Error('Missing GITHUB_ID or GITHUB_SECRET environnement')
}

export const authConfig = {
    providers: [
        GitHubProvider({
            clientId: githubId,
            clientSecret: githubSecret,
        }),
        GoogleProvider({
            clientId: googleId,
            clientSecret: googleSecret,
        }),
    ],
    callbacks: {
        session: async({session, user}) =>{
            return session;
        },
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET
} satisfies NextAuthOptions;

export default NextAuth(authConfig)