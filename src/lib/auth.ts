import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { LoginSchema } from "./zod";
import bcrypt from "bcryptjs";
import { ICredentials } from "@/interfaces/credentialsType";
import { PrismaAdapter } from "@auth/prisma-adapter"
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },
            authorize: async function(credentials) {
                const verified = LoginSchema.safeParse(credentials)
                if(!verified.success) {
                    return null
                }

                const { email, password } = verified.data as ICredentials

                const user = await prisma.user.findUnique({
                    where: {email}
                })

                if(!user) {
                    return null
                }

                if(!user.password){
                    return null
                }

                const ok = await bcrypt.compare(password, user.password)
                if(!ok) {
                    return null
                }

                return { id: String(user.id), name: user.name, email: user.email }
            }
        }),
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            issuer: "https://github.com/login/oauth",
            allowDangerousEmailAccountLinking: true
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({token, user}) {
            if(user) {
                token.sub = user.id
            }
            return token
        },
        async session({session, token}) {
            if(token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
        async signIn({user, account}) {
            if(account?.provider === "github") {

                const existing = await prisma.user.findUnique({
                    where: {email: user.email as string},
                })

                if(!existing){
                    return "/user/login/?error=no_account"
                }

                // if(existing) {
                    // const findAccount = existing.accounts.find(account => account.provider == "github")
                    // if(!findAccount) {
                    //     await prisma.account.create({
                    //         data: {
                    //             userId: existing.id,
                    //             type: account.type,
                    //             provider: account.provider,
                    //             providerAccountId: account.providerAccountId,
                    //             access_token: account.access_token,
                    //             refresh_token: account.refresh_token,
                    //             expires_at: account.expires_at,
                    //             token_type: account.token_type,
                    //             scope: account.scope,
                    //             id_token: account.id_token,
                    //         }
                    //     })
                    // }
                    
                // }
            }
            return true
        }
    }
})