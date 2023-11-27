import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},

            async authorize(credentials) {
                const { email, password } = credentials;

                try {
                    const prisma = new PrismaClient();
                    const user = await prisma.user.findUnique({
                        where: {
                            email: email,
                        }
                    });

                    if (!user) {
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (!passwordsMatch) {
                        return null;
                    }

                    return user;

                } catch (error) {
                    console.log("Error: ", error);
                }
            },
        }),
    ],
    session: {
        // strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            // session.accessToken = token.accessToken
            session.id = token.id;
            //console.log('session callback', session, token, user);
            return session
        },
        async jwt({ token, account, profile }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            // if (account) {
            //     token.accessToken = account.access_token
            //     token.id = profile.id
            // }
            token.id = token.sub;
            //console.log('jwt callback', token, account, profile);
            // console.log(token);
            // console.log(account);

            // console.log(profile);
            return token
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };



/* import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            id: 'Credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "text" },
            },
            async authorize(credentials) {
                const prisma = new PrismaClient();
                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    });
                    if (user) {
                        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.hashedPassword)
                        if (isPasswordCorrect) {
                            return user;
                        }
                    }
                } catch (error) {
                    console.log(error);
                    throw new Error(error);

                }
            },
        }),
    ],
    pages: {
        signIn: "/login"
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
})


export { handler as GET, handler as POST } */



/* import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Email', type: 'email', placeholder: 'username' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                const user = { email: email }
                if (user) {
                    console.log(user);
                    return user;
                }
                else {
                    return null;
                }
            },
        }),
    ],
})

export { handler as GET, handler as POST }

 */