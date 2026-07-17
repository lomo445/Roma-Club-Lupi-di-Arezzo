import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Mocking user for UI development purposes.
        // TODO: Replace with actual Prisma query once DB is connected:
        // const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        // if (user && user.password && await compare(credentials.password, user.password)) { return user; }
        
        if (credentials.email === "admin@lupidarezzo.it" && credentials.password === "admin") {
          return { id: "1", name: "Admin Direttivo", email: "admin@lupidarezzo.it", role: "ADMIN" };
        }
        if (credentials.email === "socio@lupidarezzo.it" && credentials.password === "socio") {
          return { id: "2", name: "Mario Rossi", email: "socio@lupidarezzo.it", role: "USER", memberNumber: 1234 };
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
