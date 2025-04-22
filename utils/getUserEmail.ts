import { authOptions } from "@/lib/auth";
import { verifyToken } from "@/lib/token";
import { getServerSession } from "next-auth";

export default async function getUserEmail(token: string | undefined | null) {
  try {
    if (token) {
      const decoded = await verifyToken(token);
      return decoded?.email;
    } else {
      const session = await getServerSession(authOptions);
      return session?.user?.email;
    }
  } catch (error) {
    return undefined;
  }
}
