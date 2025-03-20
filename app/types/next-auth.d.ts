import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extend the built-in session types
   */
  interface Session {
    user: {
      _id?: string;
      role?: "user" | "corretor" | "admin";
      subscription?: "free" | "premium";
    } & DefaultSession["user"];
  }

  /**
   * Extend the built-in user types
   */
  interface User {
    role?: "user" | "corretor" | "admin";
    subscription?: "free" | "premium";
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the built-in JWT types
   */
  interface JWT {
    id?: string;
    role?: "user" | "corretor" | "admin";
    subscription?: "free" | "premium";
  }
}
