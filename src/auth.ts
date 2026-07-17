import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({ where: { email: credentials.email as string } });
          
          if (user && user.password) {
            const isValid = await compare(credentials.password as string, user.password);
            
            if (isValid) {
              return {
                id: user.id,
                email: user.email,
                name: `${user.name} ${user.surname}`,
                role: user.role,
                memberNumber: user.memberNumber
              };
            }
          }
        } catch (error) {
          console.error("Errore di connessione al DB durante il login:", error);
        }

        return null;
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.memberNumber = (user as any).memberNumber;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).memberNumber = token.memberNumber;
        (session.user as any).id = token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
});
