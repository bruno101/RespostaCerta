import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./mongoose";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as any,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as any,
    }),
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        await connectToDatabase();
        const userFound = await User.findOne({
          email: credentials?.email,
          //verified: true,
        }).select("+password");

        if (!userFound) throw new Error("Invalid Email");

        const passwordMatch = await bcrypt.compare(
          credentials!.password,
          userFound.password
        );

        if (!passwordMatch) throw new Error("Invalid Password");
        const user = userFound.toObject();

        return {
          id: user._id.toString(), // Convert _id (ObjectId) to string
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role || "user",
          subscription: user.subscription || "free",
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only proceed if it's a Google sign in
      if (account?.provider === "google") {
        // TBD:alterar
        // Executado no servidor, deveria acessar o banco de dados diretamente
        try {
          await fetch(`${process.env.NEXTAUTH_URL}/api/users/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user?.name,
              email: user?.email,
              image: user?.image,
              signedUpWithGoogle: true,
              verified: true,
            }),
          });
          return true;
        } catch (error) {
          console.error("Error saving user", error);
          return false;
        }
      }

      // For other providers (like credentials), just return true
      return true;
    },
    async jwt({
      token,
      user,
      session,
      trigger,
      account,
    }: {
      token: JWT;
      user?: any;
      session?: any;
      trigger?: "signIn" | "signUp" | "update";
      account?: any;
    }) {
      await connectToDatabase();
      const foundUser = await User.findOne({ email: token.email });
      if (foundUser) {
        token.name = foundUser.name;
        token.image = foundUser.image;
        token.role = foundUser.role || "user";
        token.id = foundUser._id.toString();
        token.subscription = foundUser.subscription || "free";
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      return {
        ...session,
        user: {
          ...session.user,
          _id: token.id,
          image: token.image,
          name: token.name,
          role: token.role || "user",
          subscription: token.subscription || "free",
        },
      };
    },
  },
};
