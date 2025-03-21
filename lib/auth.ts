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
          verified: true,
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
      console.log("let's update");
      const foundUser = await User.findOne({ email: token.email });
      if (foundUser) {
        token.name = foundUser.name;
        token.image = foundUser.image;
        token.role = foundUser.role || "user";
        token.id = foundUser._id.toString();
        token.subscription = foundUser.subscription || "free";
      }
      console.log(token.subscription);
      /*if (trigger === "update") {
        // Fetch the user's current data from the database
        const userFound = await fetchUserFromDB(token.email); // Use the email from the token
        if (userFound) {
          // Only allow updates to non-sensitive fields (e.g., name, image)
          token.name = session?.user?.name || token.name; // Allow name update
          token.image = session?.user?.image || token.image; // Allow image update

          // Prevent updates to sensitive fields by using server-side data
          token.email = userFound.email; // Always use the email from the database
          token.role = userFound.role; // Always use the role from the database
          token.subscription = userFound.subscription; // Always use the subscription from the database
          token.id = userFound._id; // Always use the ID from the database
        }
      } else {
        if (account?.provider === "google") {
          const userFound = await User.findOne({
            email: user?.email || session?.user?.email,
          });
          if (userFound) {
            if (userFound.name) {
              token.name = userFound?.name;
            } else {
              token.name = user?.name || session?.user?.name;
            }
            if (userFound.email) {
              token.email = userFound?.email;
            } else {
              token.email = user?.email || session?.user?.email;
            }
            if (userFound.image) {
              token.image = userFound?.image;
            } else {
              token.image = user?.image || session?.user?.image;
            }
            if (userFound.role) {
              token.role = userFound?.role;
            } else {
              token.role = user?.role || session?.user?.role || "user";
            }
            if (userFound.subscription) {
              token.subscription = userFound?.subscription;
            } else {
              token.subscription =
                user?.subscription || session?.user?.subscription || "free";
            }
            if (userFound._id) {
              token.id = userFound?.id;
            } else {
              token.id = user?.id || session?.user?.id;
            }
          }
        } else if (session?.user) {
          token.name = session.user.name;
          token.email = session.user.email;
          token.image = session.user.image;
          token.role = session.user.role || "user";
          token.subscription = session.user.subscription || "free";
          token.id = session.user.id;
        } else if (user) {
          token.name = user.name;
          token.email = user.email;
          token.image = user.image;
          token.role = user.role || "user";
          token.subscription = user.subscription || "free";
          token.id = user.id;
        }
      }*/
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      console.log(token.subscription);
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
