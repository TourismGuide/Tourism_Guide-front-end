import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
  }

  interface User {
    backendToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
  }
}

const api = axios.create({
  baseURL: "http://localhost:8081/api/v1/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET!,

  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.Client_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const res = await api.post("/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const data = res.data;

          if (!data?.token) return null;

          return {
            id: data.userId,
            name: data.name,
            email: data.email,
            backendToken: data.token,
          };
        } catch (error) {
          console.error("Login failed:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const res = await api.post("/google", {
            email: user.email,
            name: user.name,
          });

          user.backendToken = res.data.token;
        } catch (error) {
          console.error("Google login sync failed:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user?.backendToken) {
        token.backendToken = user.backendToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
