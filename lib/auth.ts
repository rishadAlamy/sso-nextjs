import { NextRequest } from "next/server";
import { findSessionByToken, findUserById } from "./database";

export async function getCurrentUser(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("session")?.value;

    if (!sessionToken) {
      return null;
    }

    const session = findSessionByToken(sessionToken);
    if (!session) {
      return null;
    }

    const user = findUserById(session.userId);
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
